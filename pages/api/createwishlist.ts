import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";
import axios from "axios";

async function addToWishList(req: NextApiRequest, res: NextApiResponse) {
  const token: any = req.headers["authorization"];
  const API_KEY = process.env.API_KEY;

  if (token) {
    let userDetails: any = jwtDecode(token as string);
    // console.log('id user ',userDetails.data.id)
    const movies = req.body.moviesIDs;

    // console.log(userDetails.user.id);

    const purchased = await prisma.purchases.findMany({
      where: {
        userID: userDetails.data.id,
        OR: movies.map((movieId: string) => ({
          moviesIDs: { has: movieId },
        })),
      },
    });

    const purchasedMovies = purchased.flatMap(({ moviesIDs }) => moviesIDs);

    const cart = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: userDetails.data.id,
      },
    });

    const moviesInCart = cart.moviesIDs;

    const wishlist = await prisma.wishlist.findUniqueOrThrow({
      where: {
        userID: userDetails.data.id,
      },
    });

    const moviesInWishList = wishlist.moviesIDs;

    if (moviesInWishList.includes(req.body.moviesIDs[0])) {
      res.status(401).json({message: "Movie Is Already In the Wishlist"});
    } else if (moviesInCart.includes(req.body.moviesIDs[0])) {
      res.status(401).json("Movie Is Already In Cart");
    } else if (purchasedMovies.includes(req.body.moviesIDs[0])) {
      res.status(401).json("Movie Is Already Purchased");
    } else if (
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

      const canBeAddedtoWishlist = finalArray;

      const update = await prisma.wishlist.update({
        where: {
          userID: userDetails.data.id,
        },
        data: {
          moviesIDs: {
            push: finalArray,
          },
        },
      });

      // res.json(update);
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${req.body.moviesIDs[0]}?api_key=${API_KEY}`
      );

      res.json({ message: "Movie Added To Wishlist", data });
    }
  }
}

export default addToWishList;