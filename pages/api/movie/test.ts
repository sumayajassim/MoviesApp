import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { DarkThemeToggle } from "flowbite-react";

const API_KEY = process.env.API_KEY;

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const pageNumber = req.query.page;
  const genreId = req.query.genre;

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
    trendingMoviesArray.includes(movie) ||
    topRatedMoviesArray.includes(movie) ||
    UpcomingMoviesArray.includes(movie)
      ? (data.results[index].price = 10)
      : (data.results[index].price = 5);
  });

  res.json(data.results);
}
