import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import getMovie from "@/helpers/getmovie";
import axios from "axios";
import authUser from "@/helpers/auth";

export default async function test(
  req: NextApiRequest,
  res: NextApiResponse
) {
const API_KEY = process.env.API_KEY;

const token = req.headers["authorization"] as string

if (!req.headers["authorization"]) {
  res.json("UnAuthorized");
}

if (req.method !== "POST") {
  res.status(400).send("Not A POST Request");
}

const { confirm , code } = req.body

const {id} = await authUser(token)

  const { purchases, balance, cart , wishlist } = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      purchases: true,
      wishlist: true,
      cart: true
    },
  });

 

let cartPrice = 0;
let discount = 0;

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

  cart?.moviesIDs?.map((id: any) => {
    trendingMoviesArray.includes(+id) ||
    upcomingMoviesArray.includes(+id) ||
    topRatedMoviesArray.includes(+id)
      ? (cartPrice = cartPrice + 10)
      : (cartPrice = cartPrice + 5);
  });

const {data}  = await axios.get("http://localhost:8000/api/coupon/")

if(data){
    discount = (data.discountPercentage / 100) * cartPrice;
}

if(balance <= Math.floor(cartPrice - discount)){
    res.json({ message: "Your out of Balance" });
}

await prisma.purchases.create({
    data: {
      moviesIDs: cart?.moviesIDs,
      amount: Math.floor(cartPrice - discount),
      user: {
        connect: {
          id: id,
        },
      },
    },
  });

   await prisma.cart.update({
    where: {
      userID: id,
    },
    data: {
      moviesIDs: [],
    },
  });

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      balance: balance - Math.floor(cartPrice - discount),
    },
  });

  let purchasedMovies: string | any[] = [];

  if (purchases.length > 0) {
    purchasedMovies = purchases
      .map((movie: any) => movie.moviesIDs)
      .flatMap((x: any) => x);
  }

  const updatedWishlist = wishlist?.moviesIDs?.filter(
    (x: any) => !purchasedMovies?.includes(x)
  );

  await prisma.wishlist.update({
    where: {
      userID: id,
    },
    data: {
      moviesIDs: updatedWishlist,
    },
  });

  res.json({
    balance: balance,
    total: balance - Math.floor(cartPrice - discount),
    discountPercentage: data.discountPercentage
  })
  

}