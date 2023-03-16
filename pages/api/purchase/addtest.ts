import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwtDecode from "jwt-decode";
import getMovie from "@/components/helpers/getmovie";
import axios from "axios";

export default async function addtest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_KEY = process.env.API_KEY;
  const moviesToBePurchased = req.body.movie || [];
  let total = 0;
  const discountCode = req.body.discount;
  let price = 5;
  let discount = 0;

  let userMistakeArray: any[] = [];
  if (!req.headers["authorization"]) {
    res.json("UnAuthorized");
  }
  if (req.body.moviesIDs.length < 1) {
    res.json("No Movie's Added!");
  }
  const userDetails: any = jwtDecode(req.headers["authorization"] as string);

  const { purchases, balance } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userDetails.user.id,
    },
    include: {
      purchases: true,
    },
  });

  if (purchases.length > 0) {
    moviesToBePurchased.map(async (movie: any) => {
      purchases.includes(movie) ? userMistakeArray.push(movie) : console.log();
    });

    const purchases = await prisma.purchases.findMany({
      where: {
        userID: userDetails.user.id,
      },
    });

    // to check if the movies is bought before buying

    // const purchasedMovies = purchases
    //   .map((x: any) => x.moviesIDs)
    //   .flatMap((x: any) => x);

    // req.body.moviesIDs.map((movie: any) => {
    //   purchasedMovies.includes(movie)
    //     ? userMistakeArray.push(movie)
    //     : console.log();
    // });

    // if(userMistakeArray.length > 0){
    //     const userPurchasedMoviesDetails = await Promise.all(
    //         purchasedMovies.map(async (movieID: string) => await getMovie(movieID))
    //     );

    //  res.json({message: "please remove the following movies before buying" , movies: userPurchasedMoviesDetails.filter(Boolean)})
    // }
  }

  const trendingMovies = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
  );

  const trendingMoviesArray = trendingMovies.data.results.map(
    (id: any) => id.id
  );

  const upcomingMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
  );

  const upcomingMoviesArray = trendingMovies.data.results.map(
    (id: any) => id.id
  );

  const topRatedMovies = await axios.get(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`
  );

  const topRatedMoviesArray = trendingMovies.data.results.map(
    (id: any) => id.id
  );

  req.body.moviesIDs.map((id: any) => {
    trendingMoviesArray.includes(id * 1) ||
    upcomingMoviesArray.includes(id * 1) ||
    topRatedMoviesArray.includes(id * 1)
      ? (total = total + 10)
      : (total = total + 5);
  });

  if (req.body.code && req.body.confirm === false) {
    const { code, amount } = await prisma.discount.findFirstOrThrow({
      where: {
        code: discountCode,
      },
    });
    code ? (discount = (amount / 100) * total) : discount;
    res.json({
      message: `Your Total Will Be ${
        total - discount
      } and your balance is ${balance}`,
    });
  } else if (!req.body.code && req.body.confirm === false) {
    res.json({
      message: `Your Total Will Be ${
        total - discount
      } and your balance is ${balance}`,
    });
  }

  if (req.body.confirm === true && req.body.code) {
    const { code, amount } = await prisma.discount.findFirstOrThrow({
      where: {
        code: discountCode,
      },
    });
    code ? (discount = (amount / 100) * total) : discount;
    // console.log(balance - total - discount, balance, total, discount);
    const newPurchase = await prisma.purchases.create({
      data: {
        moviesIDs: req.body.moviesIDs,
        amount: total,
        user: {
          connect: {
            id: userDetails.user.id,
          },
        },
      },
    });

    const update = await prisma.user.update({
      where: {
        id: userDetails.user.id,
      },
      data: {
        balance: balance - total - discount,
      },
    });

    res.json({
      message: "Succesful Purchase",
      newPurchase,
      update,
    });
  } else if (req.body.confirm === true && !req.body.code) {
    const newPurchase = await prisma.purchases.create({
      data: {
        moviesIDs: req.body.moviesIDs,
        amount: total,
        user: {
          connect: {
            id: userDetails.user.id,
          },
        },
      },
    });

    const update = await prisma.user.update({
      where: {
        id: userDetails.user.id,
      },
      data: {
        balance: balance - total,
      },
    });

    res.json({
      message: "Succesful Purchase",
      newPurchase,
      update,
    });
  }

  //   const userToBePurchasedMoviesDetails = await Promise.all(
  //     req.body.moviesIDs.map(async (movieID: string) => await getMovie(movieID))
  //   );

  //   const toBePurchasedMoviesIDs = userToBePurchasedMoviesDetails.map((x:any) => x.id)
}
