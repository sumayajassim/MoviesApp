import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import authUser from "@/components/helpers/auth";
import jwtDecode from "jwt-decode";
import getMovie from "@/components/helpers/getmovie";

export default async function userDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers["authorization"];
  const API_KEY = process.env.API_KEY;

  if (!token) {
    return res.json("UnAuthorize , Please Sign In Or Create An Account ");
  }

  const userDetails: any = jwtDecode(token);

  if (!userDetails) {
    return res.json("Try Again");
  }

  const userWishlist = userDetails.user.wishlist.moviesIDs;

  const userWishlistMovieDetails = await Promise.all(
    userWishlist.map(async (movieID: string) => await getMovie(movieID))
  );

  //   console.log(userWishlistMovieDetails.filter(Boolean))

  const userCartMovies = userDetails.user.cart.moviesIDs;

  const userCartMoviesDetails = await Promise.all(
    userCartMovies.map(async (movieID: string) => await getMovie(movieID))
  );

  //   console.log(userCartMoviesDetails);

  res.json({
    user: {
      username: userDetails.user.firstName + " " + userDetails.user.firstName,
      userEmail: userDetails.useremailAddress,
      userBalance: userDetails.user.balance,
    },
    wishlist: userWishlistMovieDetails.filter(Boolean),
    cart: userCartMoviesDetails.filter(Boolean),
  });
}
