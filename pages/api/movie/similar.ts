import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";
import authUser from "@/components/helpers/auth";

export default async function getSimilarMovie(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_KEY = process.env.API_KEY;
  const token = req.headers["authorization"];

  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${req.query.movieID}/similar?api_key=${API_KEY}&language=en-US&page=1`
  );

  if (!token) {
    res.json(data);
  }

  const { id } = await authUser(token as string);

  const purchases = await prisma.purchases.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  const purchasedMovies = purchases.moviesIDs.map((movies: any) => movies);

  if (purchasedMovies.length > 0) {
    data.results.forEach((movie: any, index: any) => {
      purchasedMovies.includes(movie)
        ? (data.results[index].isPurchased = true)
        : (data.results[index].isPurchased = false);
    });
  }

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  const cartMovies = cart.moviesIDs;
  console.log(cartMovies);

  if (cartMovies.length > 0) {
    data.results.forEach((movie: any, index: number) => {
      cartMovies.includes(movie)
        ? (data.results[index].inCart = true)
        : (data.results[index].inCart = false);
    });
  }

  const wishlist = await prisma.wishlist.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  const wishlistMovies = wishlist.moviesIDs;

  if (wishlistMovies.length > 0) {
    data.results.foreach((movie: any, index: number) => {
      wishlistMovies.includes(movie)
        ? (data.results[index].inWishlist = true)
        : (data.results[index].inWishlist = false);
    });
  }

  res.json(data);
}
