import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default async function addToWishList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];
  const API_KEY = process.env.API_KEY;

  if (!token) {
    res
      .status(401)
      .send(
        "Unauthorized - Sign in if you have an account or sign up to add to the wishlist"
      );
  }

  let userDetails: any = jwtDecode(token as string);

  const movies = req.body.moviesIDs;

  const purchased = await prisma.purchases.findMany({
    where: {
      userID: userDetails.id,
      OR: movies.map((movieId: string) => ({
        moviesIDs: { has: movieId },
      })),
    },
  });

  // you could return an error here if purchases is not empty

  const purchasedMovies = purchased.flatMap(({ moviesIDs }) => moviesIDs);

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: userDetails.id,
    },
  });

  const moviesInCart = cart.moviesIDs;

  const wishlist = await prisma.wishlist.findUniqueOrThrow({
    where: {
      userID: userDetails.id,
    },
  });

  const moviesInWishList = wishlist.moviesIDs;

  if (moviesInWishList.includes(req.body.moviesIDs[0])) {
    res.status(400).json({ message: "Movie Is ALready In the Wishlist" });
  } else if (moviesInCart.includes(req.body.moviesIDs[0])) {
    res.status(400).json({ message: "Movie Is ALready In Cart" });
  } else if (purchasedMovies.includes(req.body.moviesIDs[0])) {
    res.status(400).json({ message: "Movie Is ALready Purchased" });
  }
  if (
    !moviesInWishList.includes(req.body.moviesIDs[0]) &&
    !moviesInCart.includes(req.body.moviesIDs[0]) &&
    !purchasedMovies.includes(req.body.moviesIDs[0])
  ) {
    const finalArray = movies.filter(
      (x: any) =>
        !purchasedMovies.includes(x) &&
        !moviesInCart.includes(x) &&
        !moviesInWishList.includes(x)
    );

    await prisma.wishlist.update({
      where: {
        userID: userDetails.id,
      },
      data: {
        moviesIDs: {
          push: finalArray,
        },
      },
    });

    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.body.moviesIDs[0]}?api_key=${API_KEY}`
    );

    res.json({ message: "Movie Added To Wishlist", data });
  }
}
