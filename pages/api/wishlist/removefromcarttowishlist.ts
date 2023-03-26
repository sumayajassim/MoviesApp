import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import authUser from "@/components/helpers/auth";

export default async function reAdd(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).send("UnAuthorized - Sign in /Sign Up First");
  }

  if (req.method !== "POST") {
    res.status(401).send("Not A POST Request");
  }

  const { id } = await authUser(token as string);

  let movie = req.body.moviesIDs[0];

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  let moviesInCart = cart.moviesIDs;

  if (req.body.moviesIDs) {
    let moviesToBeRemoved = moviesInCart.filter(
      (x, index) => moviesInCart[index] != movie
    );

    await prisma.cart.update({
      where: {
        userID: id,
      },
      data: {
        moviesIDs: moviesToBeRemoved,
      },
    });

    await prisma.wishlist.update({
      where: {
        userID: id,
      },
      data: {
        moviesIDs: {
          push: movie,
        },
      },
    });

    res.json({ message: "Added To Wishlist" });
  }
}
