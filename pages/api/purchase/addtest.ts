import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwtDecode from "jwt-decode";

export default async function addtest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_KEY = process.env.API_KEY;
  const moviesToBePurchased = req.body.movie || null;
  const total = req.body.total || null;
  const discount = req.body.discount;

  let userMistakeArray: any[] = [];

  const userDetails: any = jwtDecode(req.headers["authorization"] as string);

  if (!req.headers["authorization"]) {
    res.json("UnAuthorized");
  }

  if (!req.body.movieIDs) {
    res.json("No Movie's Added!");
  }

  if (!req.body.total) {
    res.json("No Movie's Added!");
  }

  const movies = req.body.moviesIDs;
  const cartMovies = userDetails.user.cart.moviesIDs;
  const cartWishlist = userDetails.user.wishlist.moviesIDs;

  const purchases = await prisma.purchases.findMany({
    where: {
      userID: userDetails.user.id,
    },
  });

  const purchasedMovies = purchases
    .map((movie: any) => movie.moviesIDs)
    .flatMap((x: any) => x);

  movies.map((movie: any, index: any) => {
    moviesToBePurchased.includes(movie)
      ? userMistakeArray.push(movie)
      : console.log();
  });
}
