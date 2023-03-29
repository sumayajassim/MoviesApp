import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import getMovie from "@/helpers/getmovie";
import axios from "axios";
import authUser from "@/helpers/auth";
import { AxiosResponse, AxiosError } from "axios";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.API_KEY;

  const token = req.headers["authorization"] as string;

  if (!req.headers["authorization"]) {
    res.json("UnAuthorized");
  }

  if (req.method !== "POST") {
    res.status(400).send("Not A POST Request");
  }

  const { code } = req.body;

  const { id } = await authUser(token);

  const { purchases, balance, cart, wishlist } =
    await prisma.user.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        purchases: true,
        wishlist: true,
        cart: true,
      },
    });

  let discount = 0;
  let discountPercentage = 0;

  const checkCartPrice = await axios.post(
    "http://localhost:8000/api/cart/getCartBalance",
    { cart }
  );

  const cartPrice = checkCartPrice.data;

  if (code) {
    const checkCoupon = async () => {
      try {
        const check = await axios.post("http://localhost:8000/api/coupon/", {
          code,
        });
        discountPercentage = check.data.discountPercentage;

        discount = (check.data.discountPercentage / 100) * cartPrice;
      } catch {
        return res.status(404).json("invalid coupon");
      }
    };
    await checkCoupon();
  }

  if (balance <= Math.floor(cartPrice - discount)) {
    res.status(400).json({ message: "Your out of Balance" });
  } else {
    await prisma.purchases.create({
      data: {
        moviesIDs: cart?.moviesIDs,
        amount: Math.floor(cartPrice - discount),
        user: {
          connect: {
            id: id,
          },
        },
      },
    });

    await prisma.cart.update({
      where: {
        userID: id,
      },
      data: {
        moviesIDs: [],
      },
    });

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        balance: balance - Math.floor(cartPrice - discount),
      },
    });

    let purchasedMovies: string | any[] = [];

    if (purchases.length > 0) {
      purchasedMovies = purchases
        .map((movie: any) => movie.moviesIDs)
        .flatMap((x: any) => x);
    }

    const updatedWishlist = wishlist?.moviesIDs?.filter(
      (x: any) => !purchasedMovies?.includes(x)
    );

    await prisma.wishlist.update({
      where: {
        userID: id,
      },
      data: {
        moviesIDs: updatedWishlist,
      },
    });

    res.json({ message: "Purchase Succesful" });
  }
}
