import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_KEY = process.env.API_KEY;

export default async function cartBalance(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(401).send("UnAuthorized");
  }

  const { cart } = req.body;

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

  let cartPrice = 0;

  cart.moviesIDs?.map((id: number) => {
    trendingMoviesArray.includes(id) ||
    upcomingMoviesArray.includes(id) ||
    topRatedMoviesArray.includes(id)
      ? (cartPrice = cartPrice + 10)
      : (cartPrice = cartPrice + 5);
  });

  res.json(cartPrice);
}
