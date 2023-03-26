import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";
import getMovie from "@/components/helpers/getmovie";
import axios from "axios";

const BADGES = {
  obama: {
    id: 1,
    name: "Obama",
    url: "/badges/obama.png",
  },
  phoenix: {
    id: 2,
    name: "/Phoenix",
    url: "/badges/phoenix.jpg",
  },
  putin: {
    id: 3,
    name: "/Putin",
    url: "/badges/phoenix.jpg",
  },
  yuda: {
    id: 4,
    name: "/Yuda",
    url: "/badges/yuda.webp",
  },
  ramen: {
    id: 4,
    name: "/Yuda",
    url: "/badges/ramen.png",
  },
};

export default async function details(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];

  if (!req.headers["authorization"]) {
    res
      .status(401)
      .send("UnAuthorized - Sign in If You Have An Account Or Sign Up");
  }

  let userDetails: any = jwtDecode(token as string);

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userDetails.user.id,
    },
    include: {
      wishlist: true,
      cart: true,
      purchases: true,
    },
  });

  const userWishlistLength = user.wishlist?.moviesIDs.length || [];
  const userCartLength = user.cart?.moviesIDs.length || [];

  let wishlistLength = user.wishlist?.moviesIDs.length || [];
  let purchasedMovies = [];
  let userWishlistMovieDetails = [];
  let userCartMoviesDetails: any[] = [];
  let badges: any = [];

  if (user.purchases.length > 0) {
    purchasedMovies = user.purchases
      .map((movie: any) => movie.moviesIDs)
      .flatMap((movies: any) => movies);

    await prisma.purchases.findUniqueOrThrow({
      where: {
        userID: userDetails.user.id,
      },
    });

    const userPurchasedMoviesDetails = await Promise.all(
      purchasedMovies.map(async (movieID: string) => await getMovie(movieID))
    );

    purchasedMovies = userPurchasedMoviesDetails;
  }

  if (wishlistLength > 0) {
    const userWishlist = await prisma.wishlist.findUniqueOrThrow({
      where: {
        userID: userDetails.user.id,
      },
    });

    userWishlistMovieDetails = await Promise.all(
      userWishlist.moviesIDs.map(
        async (movieID: string) => await getMovie(movieID)
      )
    );
  }

  if (userCartLength > 0) {
    const userCartMovies = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: userDetails.user.id,
      },
    });

    userCartMoviesDetails = await Promise.all(
      userCartMovies.moviesIDs.map(
        async (movieID: string) => await getMovie(movieID)
      )
    );
  }

  const trendingMovies = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
  );

  const trendingMoviesArray = trendingMovies.data.results.map(
    (movie: any) => movie.id
  );

  const upcomingMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
  );

  const upcomingMoviesArray = upcomingMovies.data.results.map(
    (movie: any) => movie.id
  );

  const topRatedMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
  );

  const topRatedMoviesArray = topRatedMovies.data.results.map(
    (movie: any) => movie.id
  );

  const cartMovies = user?.cart?.moviesIDs;

  cartMovies?.map((movie: any, index: any) => {
    trendingMoviesArray.includes(+movie) ||
    upcomingMoviesArray.includes(+movie) ||
    topRatedMoviesArray.includes(+movie)
      ? (userCartMoviesDetails[index].price = 10)
      : (userCartMoviesDetails[index].price = 5);
  });

  let userPurchasesLength = purchasedMovies.length || 0;

  if (userPurchasesLength >= 0) {
    badges = [BADGES.obama.url];
  }

  if (userPurchasesLength >= 1) {
    badges = [BADGES.putin.url];
  }

  if (userPurchasesLength >= 2) {
    badges = [BADGES.ramen.url];
  }

  if (userPurchasesLength >= 5) {
    badges = [BADGES.phoenix.url];
  }

  if (userPurchasesLength >= 10) {
    badges = [BADGES.yuda.url];
  }

  const userr = {
    userName: userDetails.user.firstName + " " + userDetails.user.lastName,
    email: userDetails.user.emailAddress,
    balance: user.balance,
    badges,
  };

  res.json({
    user: userr,
    wishlist: userWishlistMovieDetails,
    cart: userCartMoviesDetails,
    purchases: purchasedMovies,
  });
}

// change all x to movie / user validation? / ?
