import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "../../../lib/prisma";
import getMovie from "@/components/helpers/getmovie";
import jwtDecode from "jwt-decode";

export default async function movie(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) throw Error("API key is not provided");

  const movieID = req.query.id as string;

  let movie: any = await getMovie(movieID);

  if (!req.headers["authorization"]) {
    res.json(movie);
  } else {
    const userDetails: any = jwtDecode(req?.headers["authorization"] as string);

    const { purchases, wishlist, cart } = await prisma.user.findUniqueOrThrow({
      where: {
        id: userDetails.id,
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
    let price = 5;

    const wishlistMoviesLength = wishlist?.moviesIDs?.length || 0;
    const cartMoviesLength = cart?.moviesIDs?.length || 0;

    if (purchases.length > 0) {
      let purchasedMOviesArray = purchases
        .map((movie: any) => movie.moviesIDs)
        .flatMap((x: any) => x);
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

    const trendingMovies = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`
    );

    const trendingMoviesArray = trendingMovies.data.results.map(
      (id: any) => id.id
    );

    const upcomingMovies = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
    );

    const upcomingMoviesArray = upcomingMovies.data.results.map(
      (id: any) => id.id
    );

    const topRatedMovies = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    );

    const topRatedMoviesArray = topRatedMovies.data.results.map(
      (id: any) => id.id
    );

    if (
      trendingMoviesArray.includes(+movieID) ||
      upcomingMoviesArray.includes(+movieID) ||
      topRatedMoviesArray.includes(+movieID)
    ) {
      price = 10;
    }
    movie = { ...movie, isPurchased, inCart, inWishlist, price };
    res.json(movie);
  }
}
