import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function getSimilarMovie(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userDetails: any = jwtDecode(req.headers["authorization"] as string);

  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${req.query.movieID}/similar?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
  );

  if (!userDetails) {
    res.json(data);
  }

  const purchases = await prisma.purchases.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  const purchasedMovies = purchases.moviesIDs.map((x: any) => x);

  if (purchasedMovies.length > 0) {
    data.results.map((x: any, index: any) => {
      purchasedMovies.includes(x)
        ? (data.results[index].isPurchased = true)
        : (data.results[index].isPurchased = false);
    });
  }

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  const cartMovies = cart.moviesIDs;
  console.log(cartMovies);

  if (cartMovies.length > 0) {
    data.results.map((x: any, index: any) => {
      cartMovies.includes(x)
        ? (data.results[index].inCart = true)
        : (data.results[index].inCart = false);
    });
  }

  const wishlist = await prisma.wishlist.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  const wishlistMovies = wishlist.moviesIDs;

  if (wishlistMovies.length > 0) {
    data.results.map((x: any, index: any) => {
      wishlistMovies.includes(x)
        ? (data.results[index].inWishlist = true)
        : (data.results[index].inWishlist = false);
    });
  }

  res.json(data);
}

// x to movie
