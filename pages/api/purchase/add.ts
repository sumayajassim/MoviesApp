import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default async function addtest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_KEY = process.env.API_KEY;
  let discount = 0;
  const discountCodes = await prisma.discount.findMany();
  const allCodes = discountCodes.map((x: any) => x.code);
  const codeSent = req.body.code || null;
  let percentage = 0;
  let cartPrice = 0;

  if (!req.headers["authorization"]) {
    res.status(401).send("UnAuthorized");
  }

  if (req.body.code) {
    if (allCodes.includes(req.body.code)) {
      const discountCode = await prisma.discount.findFirstOrThrow({
        where: {
          code: codeSent,
        },
      });

      percentage = discountCode.amount;
      discount = (discountCode.amount / 100) * cartPrice;
    } else {
      res.status(401).json({ message: "Invalid Discount Code" });
      discount = 0;
    }
  }

  const userDetails: any = jwtDecode(req.headers["authorization"] as string);

  const { purchases, balance, wishlist } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userDetails.user.id,
    },
    include: {
      purchases: true,
      wishlist: true,
    },
  });

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  const cartMovies = cart.moviesIDs;
  const wishlistMovies = wishlist?.moviesIDs;

  const trendingMovies = await axios.get(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`
  );

  const trendingMoviesArray = trendingMovies.data.results.map(
    (movie: any) => movie.id
  );

  const upcomingMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
  );

  const upcomingMoviesArray = trendingMovies.data.results.map(
    (movie: any) => movie.id
  );

  const topRatedMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  );

  const topRatedMoviesArray = trendingMovies.data.results.map(
    (movie: any) => movie.id
  );

  cartMovies.map((id: any) => {
    trendingMoviesArray.includes(+id) ||
    upcomingMoviesArray.includes(+id) ||
    topRatedMoviesArray.includes(+id)
      ? (cartPrice = cartPrice + 10)
      : (cartPrice = cartPrice + 5);
  });

  let purchasedMovies: string | any[] = [];

  if (purchases.length > 0) {
    purchasedMovies = purchases
      .map((movie: any) => movie.moviesIDs)
      .flatMap((movies: any) => movies);
  }

  console.log(purchasedMovies);

  if (req.body.confirm == false) {
    res.json({
      total: Math.floor(cartPrice - discount),
      balance: balance,
      discountPercentage: percentage,
    });
  } else if (req.body.confirm == true) {
    if (balance >= Math.floor(cartPrice - discount)) {
      const makePurchase = await prisma.purchases.create({
        data: {
          moviesIDs: cartMovies,
          amount: Math.floor(cartPrice - discount),
          user: {
            connect: {
              id: userDetails.user.id,
            },
          },
        },
      });

      const removeFromCart = await prisma.cart.update({
        where: {
          userID: userDetails.user.id,
        },
        data: {
          moviesIDs: [],
        },
      });

      await prisma.user.update({
        where: {
          id: userDetails.user.id,
        },
        data: {
          balance: balance - Math.floor(cartPrice - discount),
        },
      });

      const updatedWishlist = wishlistMovies?.filter(
        (x: any) => !purchasedMovies?.includes(x)
      );

      await prisma.wishlist.update({
        where: {
          userID: userDetails.user.id,
        },
        data: {
          moviesIDs: updatedWishlist,
        },
      });

      res.json({
        balance: balance,
        total: balance - Math.floor(cartPrice - discount),
        discountPercentage: percentage,
        makePurchase,
        removeFromCart,
        wishlist: wishlist,
      });
    } else {
      res.json({ message: "Your out of Balance" });
    }
  }
}
