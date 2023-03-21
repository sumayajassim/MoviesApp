import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "../../../lib/prisma";
import getMovie from "@/components/helpers/getmovie";
import jwtDecode from "jwt-decode";

export default async function movie(req: NextApiRequest, res: NextApiResponse) {
  // req.headers["authorization"] ? console.log(true) : console.log(false)

  // //// another any. it should be a string
  const movieID: any = req.query;

  // //// this should be a const, and should be typed
  let movie: any = await getMovie(movieID.id);

  // //// this should be a guard clause to reduce nesting
  if (!req.headers["authorization"]) {
    res.json(movie);
  } else {
    const userDetails: any = jwtDecode(req?.headers["authorization"] as string);

    // //// these should be separate database calls as we have no need for the user.
    const { purchases, wishlist, cart } = await prisma.user.findUniqueOrThrow({
      where: {
        id: userDetails.user.id,
      },
      include: {
        wishlist: true,
        cart: true,
        purchases: true,
      },
    });

    // //// too many unnecessary lets.
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
      purchasedMOviesArray.includes(movieID.id)
        ? (isPurchased = true)
        : (isPurchased = false);
    }
    if (wishlistMoviesLength > 0) {
      wishlist?.moviesIDs.includes(movieID.id)
        ? (inWishlist = true)
        : (inWishlist = false);
    }
    if (cartMoviesLength > 0) {
      cart?.moviesIDs.includes(movieID.id) ? (inCart = true) : (inCart = false);
    }

    // //// the API KEY should be in an environment variable. Very bad practice to have it in the code.
    const trendingMovies = await axios.get(
      "https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
    );

    const trendingMoviesArray = trendingMovies.data.results.map(
      (id: any) => id.id
    );

    // //// we are making requests to the API while we are not using the data. we should only make requests when we need the data.
    const upcomingMovies = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
    );

    const upcomingMoviesArray = trendingMovies.data.results.map(
      (id: any) => id.id
    );

    // //// same as above
    const topRatedMovies = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
    );

    const topRatedMoviesArray = trendingMovies.data.results.map(
      // //// 1. this should not be an any, 2. it should be movie.id not id.id
      (id: any) => id.id
    );

    if (
      // //// what's the purpose of the * 1?
      trendingMoviesArray.includes(movieID.id * 1) ||
      upcomingMoviesArray.includes(movieID.id * 1) ||
      topRatedMoviesArray.includes(movieID.id * 1)
    ) {
      price = 10;
    }
    movie = { ...movie, isPurchased, inCart, inWishlist, price };
    res.json(movie);
  }
}
