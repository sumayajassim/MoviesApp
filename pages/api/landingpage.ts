import { Movie } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";
import _ from "lodash";
const API_KEY = process.env.API_KEY;
if (!API_KEY) throw Error("API key is not provided");

export default async function landingpage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers["authorization"];
  const trendingMovies_ = await trendingMovies();
  const upcomingMovies_ = await upcomingMovies();
  const nowPlaying_ = await nowPlaying();
  const topRated_ = await topRated();

  function mappingTheData(array) {
    return array.map((movie: any) => ({
      ...movie,
      poster_path: "https://image.tmdb.org/t/p/original" + movie.poster_path,
      price: 10,
    }));
  }

  async function trendingMovies() {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
    );
    return mappingTheData(data.results);
  }

  async function upcomingMovies() {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
    );
    return mappingTheData(data.results);
  }

  async function nowPlaying() {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US`
    );
    return mappingTheData(data.results);
  }

  async function topRated() {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    );
    return mappingTheData(data.results);
  }

  if (token) {
    const userDetails: any = jwtDecode(token as string);

    const userData = await prisma.user.findUniqueOrThrow({
      where: { id: userDetails.user.id },
      include: {
        wishlist: true,
        cart: true,
        purchases: true,
      },
    });

    const userPurchases = userData.purchases
      .map(({ moviesIDs }) => moviesIDs)
      .flat();

    const checkUserActivities = (array: any[]) => {
      array.map((movie) => {
        if (userData?.wishlist?.moviesIDs.includes(movie.id.toString())) {
          movie["inWishlist"] = true;
        } else {
          movie["inWishlist"] = false;
        }
        if (userData?.cart?.moviesIDs.includes(movie.id.toString())) {
          movie["inCart"] = true;
        } else {
          movie["inCart"] = false;
        }
        if (userPurchases?.includes(movie.id.toString())) {
          movie["isPurchased"] = true;
        } else {
          movie["isPurchased"] = false;
        }
      });
    };
    checkUserActivities(trendingMovies_);
    checkUserActivities(upcomingMovies_);
    checkUserActivities(topRated_);
    checkUserActivities(nowPlaying_);
  }

  res.json([
    {
      id: Math.floor(Math.random() * 10),
      title: "TRENDING MOVIES",
      movies: trendingMovies_,
    },
    {
      id: Math.floor(Math.random() * 10000),
      title: "TOP RATED ",
      movies: topRated_,
    },
    {
      id: Math.floor(Math.random() * 100),
      title: "UPCOMING MOVIES",
      movies: upcomingMovies_,
    },
    {
      id: Math.floor(Math.random() * 1000),
      title: "NOW PLAYING IN THEATRES",
      movies: nowPlaying_,
    },
  ]);
}
