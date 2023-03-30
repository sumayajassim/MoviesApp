import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "../../../lib/prisma";
import getMovie from "@/helpers/getmovie";
import jwtDecode from "jwt-decode";
import authUser from "@/helpers/auth";

export default async function movie(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) throw Error("API key is not provided");

  const movieID = req.query.id as string;

  let movie = await getMovie(movieID);
  let price = 5;

  const token = req.headers["authorization"];

  if (req.method !== "GET") {
    res.status(401).send("Not A GET Request");
  }

  const trendingMovies = await axios.get(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`
  );

  const trendingMoviesArray = trendingMovies.data.results.map(
    (movie: { id: number }) => movie.id as number
  );

  const upcomingMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
  );

  const upcomingMoviesArray = upcomingMovies.data.results.map(
    (movie: { id: number }) => movie.id as number
  );

  const topRatedMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  );

  const topRatedMoviesArray = topRatedMovies.data.results.map(
    (movie: { id: number }) => movie.id as number
  );

  if (
    trendingMoviesArray.includes(+movieID) ||
    upcomingMoviesArray.includes(+movieID) ||
    topRatedMoviesArray.includes(+movieID)
  ) {
    price = 10;
  }

  if (!token) {
    movie.price = price;
    res.json(movie);
  } else {
    const { id } = await authUser(token);

    const { purchases, wishlist, cart } = await prisma.user.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        wishlist: true,
        cart: true,
        purchases: true,
      },
    });

    let isPurchased = false;
    let inCart = false;
    let inWishlist = false;

    const wishlistMoviesLength = wishlist?.moviesIDs?.length || 0;
    const cartMoviesLength = cart?.moviesIDs?.length || 0;

    if (purchases.length > 0) {
      let purchasedMOviesArray = purchases
        .map((movie) => movie.moviesIDs)
        .flatMap((x) => x);
      purchasedMOviesArray.includes(movieID)
        ? (isPurchased = true)
        : (isPurchased = false);
    }
    if (wishlistMoviesLength > 0) {
      wishlist?.moviesIDs.includes(movieID)
        ? (inWishlist = true)
        : (inWishlist = false);
    }
    if (cartMoviesLength > 0) {
      cart?.moviesIDs.includes(movieID) ? (inCart = true) : (inCart = false);
    }

    movie = { ...movie, isPurchased, inCart, inWishlist, price };
    res.json(movie);
  }
}
