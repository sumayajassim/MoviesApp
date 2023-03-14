import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";

const API_KEY = process.env.API_KEY;
if (!API_KEY) throw Error("API key is not provided");

export default async function landingpage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers["authorization"];

  if (!token) {
    res.json([
      {
        id: Math.floor(Math.random() * 10),
        title: "TRENDING MOVIES",
        movies: await trendingMovies(),
        price: 10,
      },
      {
        id: Math.floor(Math.random() * 10000),
        title: "TOP RATED ",
        movies: await topRated(),
        price: 10,
      },
      {
        id: Math.floor(Math.random() * 100),
        title: "UPCOMING MOVIES",
        movies: await UpcomingMovies(),
        price: 10,
      },
      {
        id: Math.floor(Math.random() * 1000),
        title: "NOW PLAYING IN THEATRES",
        movies: await nowPlaying(),
        price: 10,
      },
    ]);
  }

  const userDetails: any = jwtDecode(token as string);

  const purchases = await prisma.purchases.findMany({
    where: {
      userID: userDetails.user.id,
    },
  });

  const purchasedMovies = purchases
    .map((x: any) => x.moviesIDs)
    .flatMap((x: any) => x);

  console.log(purchasedMovies);

  const trendingMovies1 = await trendingMovies();

  const trendingMoviesArray = trendingMovies1.map((movie: any) => movie.id);

  console.log(trendingMoviesArray.has(10));

  // purchasedMovies.map((x: any, index: number) => {
  //   // trendingMoviesArray.includes(x)
  //   //   ? (trendingMovies1[index].isPurchased = true)
  //   //   : (trendingMovies1[index].isPurchased = false);
  //   console.log(trendingMovies1[index]);
  // });

  // res.json(trendingMovies1);
}

async function trendingMovies() {
  const { data } = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
  );

  data.results.map(
    (movie: any) =>
      (movie.poster_path =
        "https://image.tmdb.org/t/p/original" + movie.poster_path)
  );

  return data.results;
}

async function UpcomingMovies() {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
  );

  data.results.map(
    (movie: any) =>
      (movie.poster_path =
        "https://image.tmdb.org/t/p/original" + movie.poster_path)
  );

  return data.results;
}

async function nowPlaying() {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US`
  );

  data.results.map(
    (movie: any) =>
      (movie.poster_path =
        "https://image.tmdb.org/t/p/original" + movie.poster_path)
  );

  return data.results;
}

async function topRated() {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  );

  data.results.map(
    (movie: any) =>
      (movie.poster_path =
        "https://image.tmdb.org/t/p/original" + movie.poster_path)
  );

  return data.results;
}
