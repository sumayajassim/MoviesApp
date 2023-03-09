import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_KEY = process.env.API_KEY
if(!API_KEY) throw Error('API key is not provided')

export default async function landingpage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.json([
    {
      id: Math.floor(Math.random() * 10),
      title: "TRENDING MOVIES",
      movies: await trendingMovies(),
    },
    {
      id: Math.floor(Math.random() * 10000),
      title: "TOP RATED ",
      movies: await topRated(),
    },
    {
      id: Math.floor(Math.random() * 100),
      title: "UPCOMING MOVIES",
      movies: await UpcomingMovies(),
    },
    {
      id: Math.floor(Math.random() * 1000),
      title: "NOW PLAYING IN THEATRES",
      movies: await nowPlaying(),
    }
    
  ]);
}

async function trendingMovies() {
  const { data } = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
  );

  return data.results;
}

async function UpcomingMovies() {
  const { data } = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`);
  return data.results;
}

async function nowPlaying() {
  const { data } = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US`);
  return data.results;
}

async function topRated() {
  const { data } = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
  return data.results;
}
