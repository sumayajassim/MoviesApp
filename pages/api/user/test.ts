import { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";
import getMovie from "@/components/helpers/getmovie";
import { prisma } from "../../../lib/prisma";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["authorization"];

  const userDetails: any = jwtDecode(token as string);

  const userWishlist = userDetails.user.wishlist.moviesIDs;

  const userWishlistMovieDetails = await Promise.all(
    userWishlist.map(async (movieID: string) => await getMovie(movieID))
  );

  const userCartMovies = userDetails.user.cart.moviesIDs;

  const userCartMoviesDetails = await Promise.all(
    userCartMovies.map(async (movieID: string) => await getMovie(movieID))
  );

  const userPurchases = await prisma.purchases.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  const user = {
    userName: userDetails.user.firstName + " " + userDetails.user.firstName,
    email: userDetails.user.emailAddress,
    balance: userDetails.user.balance,
  };

  res.json({
    user,
    wishlist: userWishlistMovieDetails.filter(Boolean),
    cart: userCartMoviesDetails.filter(Boolean),
    purchases: userDetails.user.moviesIDs,
  });
}
