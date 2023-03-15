import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";
import getMovie from "@/components/helpers/getmovie";

export default async function details2(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userDetails: any = jwtDecode(req.headers["authorization"] as string);

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userDetails.user.id,
    },
    include: {
      wishlist: true,
      cart: true,
      purchases: true,
    },
  });

  //   res.json(user.purchases.length);

  const userWishlist = userDetails.user.wishlist.moviesIDs;

  const userWishlistMovieDetails = await Promise.all(
    userWishlist.map(async (movieID: string) => await getMovie(movieID))
  );

  const userCartMovies = userDetails.user.cart.moviesIDs;

  const userCartMoviesDetails = await Promise.all(
    userCartMovies.map(async (movieID: string) => await getMovie(movieID))
  );

  if (user.purchases.length > 0) {
    let badges = ["/badges/obama.png"];

    const { moviesIDs } = await prisma.purchases.findUniqueOrThrow({
      where: {
        userID: userDetails.user.id,
      },
    });

    const purchasedMovies = moviesIDs.flatMap((x: any) => x);

    const userPurchasedMoviesDetails = await Promise.all(
      purchasedMovies.map(async (movieID: string) => await getMovie(movieID))
    );

    // if (purchasedMovies.length > 1) {
    //     badges = ["/badges/obama.png", "/badges/putin.png"];
    //   }

    //   if (purchasedMovies.length > 2) {
    //     badges = ["/badges/obama.png", "/badges/putin.png", "/badges/ramen.png"];
    //   }

    //   if (purchasedMovies.length > 5) {
    //     badges = [
    //       "/badges/obama.png",
    //       "/badges/putin.png",
    //       "/badges/ramen.png",
    //       "/badges/phoenix.png",
    //     ];

    //     if (purchasedMovies.length > 5) {
    //         badges = [
    //           "/badges/obama.png",
    //           "/badges/putin.png",
    //           "/badges/ramen.png",
    //           "/badges/phoenix.png",
    //           "/badges/yuda.png"
    //         ];
    //   }

    const userr = {
      userName: userDetails.user.firstName + " " + userDetails.user.firstName,
      email: userDetails.user.emailAddress,
      balance: userDetails.user.balance,
      badges,
    };

    res.json({
      userr,
      wishlist: userWishlistMovieDetails.filter(Boolean),
      cart: userCartMoviesDetails.filter(Boolean),
      purchases: userPurchasedMoviesDetails.filter(Boolean),
    });
  } else {
    const userr = {
      userName: userDetails.user.firstName + " " + userDetails.user.firstName,
      email: userDetails.user.emailAddress,
      balance: userDetails.user.balance,
    };

    res.json({
      userr,
      wishlist: userWishlistMovieDetails.filter(Boolean),
      cart: userCartMoviesDetails.filter(Boolean),
      purchases: userDetails.user.moviesIDs,
    });
  }
}

const BADGES = {
  obama: {
    id: 1,
    name: "Obama",
    url: "/badges/obama.png",
  },
  phoenix: {
    id: 2,
    name: "/Phoenix",
    url: "/badges/phoenix.jpg",
  },
  putin: {
    id: 3,
    name: "/Putin",
    url: "/badges/phoenix.jpg",
  },
  yuda: {
    id: 2,
    name: "/Yuda",
    url: "/badges/yuda.webp",
  },
};
