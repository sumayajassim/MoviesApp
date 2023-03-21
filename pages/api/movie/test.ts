// /// why does this exist?

import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

const API_KEY = process.env.API_KEY;

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["authorization"];

  if (!token) {
    const pageNumber = req.query.page || 1;
    const searchText = req.query.search;
    const genreId = req.query.genre || null;
    try {
      if (!searchText) {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=original_title.asc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate&with_genres=${genreId}`
        );
        res.json(data);
      } else {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchText}`
        );
        res.json(data);
      }
    } catch (err) {
      res.send(err);
    }
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=original_title.asc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate&with_genres=${genreId}`
    );

    const movieIdsArray = data.results.map(
      (movie: string, index: any) => data.results[index].id
    );

    const trendingMovies = await axios.get(
      "https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
    );

    const trendingMoviesArray = data.results.map(
      (movie: string, index: any) => trendingMovies.data.results[index].id
    );

    const topRatedMovies = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    );

    const topRatedMoviesArray = data.results.map(
      (movie: string, index: any) => topRatedMovies.data.results[index].id
    );

    const UpcomingMovies = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
    );

    const UpcomingMoviesArray = data.results.map(
      (movie: string, index: any) => UpcomingMovies.data.results[index].id
    );

    movieIdsArray.map((movie: string, index: any) => {
      trendingMoviesArray.includes(movie.toString()) ||
      topRatedMoviesArray.includes(movie.toString()) ||
      UpcomingMoviesArray.includes(movie.toString())
        ? (data.results[index].price = 10)
        : (data.results[index].price = 5);
    });

    return res.json(data.results);
  }

  // authorized

  const userDetails: any = jwtDecode(token as string);
  const pageNumber = req.query.page || 1;
  const searchText = req.query.search;
  const genreId = req.query.genre || null;
  try {
    if (!searchText) {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=original_title.asc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate&with_genres=${genreId}`
      );
      res.json(data);
    } else {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchText}`
      );
      res.json(data);
    }
  } catch (err) {
    res.send(err);
  }

  const { data } = await axios.get(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=original_title.asc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate&with_genres=${genreId}`
  );

  const movieIdsArray = data.results.map(
    (movie: string, index: any) => data.results[index].id
  );

  const trendingMovies = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
  );

  const trendingMoviesArray = data.results.map(
    (movie: string, index: any) => trendingMovies.data.results[index].id
  );

  const topRatedMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  );

  const topRatedMoviesArray = data.results.map(
    (movie: string, index: any) => topRatedMovies.data.results[index].id
  );

  const UpcomingMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
  );

  const UpcomingMoviesArray = data.results.map(
    (movie: string, index: any) => UpcomingMovies.data.results[index].id
  );

  movieIdsArray.map((movie: string, index: any) => {
    trendingMoviesArray.includes(movie.toString()) ||
    topRatedMoviesArray.includes(movie.toString()) ||
    UpcomingMoviesArray.includes(movie.toString())
      ? (data.results[index].price = 10)
      : (data.results[index].price = 5);
  });

  const purchases = await prisma.purchases.findMany({
    where: {
      userID: userDetails.user.id,
    },
  });

  const purchasedMovies = purchases
    .map((x: any, index: number) => x.moviesIDs)
    .flatMap((x) => x);

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  const userCart = cart.moviesIDs;

  const wishlist = await prisma.wishlist.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  const userWishlist = wishlist.moviesIDs;

  movieIdsArray.map((movie: any, index: number) => {
    purchasedMovies.includes(movie.toString())
      ? (data.results[index].isPurchased = true)
      : (data.results[index].isPurchased = false);
  });

  movieIdsArray.map((movie: any, index: number) => {
    userCart.includes(movie.toString())
      ? (data.results[index].inCart = true)
      : (data.results[index].inCart = false);
  });

  movieIdsArray.map((movie: any, index: number) => {
    userWishlist.includes(movie.toString())
      ? (data.results[index].inWishlist = true)
      : (data.results[index].inWishlist = false);
  });

  res.json(data);
}
