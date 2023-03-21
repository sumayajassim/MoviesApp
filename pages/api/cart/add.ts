import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function addToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];

  // //// you can use a guard clause to reduce nesting. 
  if (token) {
    // //// never use any.
    let userDetails: any = jwtDecode(token as string);
    const id = userDetails.user.id;

    const movies: string[] = req.body.moviesIDs || [];

    // const movie = 'fdfd'

    const purchased = (
      await prisma.purchases.findMany({
        where: {
          OR: movies.map((movieId) => ({
            moviesIDs: { has: movieId },
          })),
          userID: userDetails.user.id,
        },
      })
    ).flatMap(({ moviesIDs }) => moviesIDs);

    // //// this is returning the cart, not if X is in the cart.
    const alreadyInCart = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: userDetails.user.id,
      },
    });

    // //// this should be a const
    let userMoviesInCart = alreadyInCart.moviesIDs;
    // //// you have logic here that is not needed. 
    const isInCart = alreadyInCart.moviesIDs.includes(movies[0]);
    const isPurchased = purchased.includes(movies[0]);

    // //// final array of what?
    let finalArray = movies.filter(
      (x) => !purchased.includes(x) && !userMoviesInCart.includes(x)
    );

    // //// if purchased length is more than 0, then the movie is already purchased.
    if (purchased.includes(movies[0])) {
      res.status(401).json({ message: "Movie is already purchased" });
      // //// if you're only checking for one movies, why is it an array?
    } else if (userMoviesInCart.includes(movies[0])) {
      res.status(401).json({ message: "Movie is already in cart" });
      // //// we already know that the movie is not in the cart or purchased, so we don't need to check again.
    } else if (
      !purchased.includes(movies[0]) &&
      !userMoviesInCart.includes(movies[0])
    ) {
      // //// this should be called cart, not updateCart.
      const updateCart = await prisma.cart.update({
        where: {
          userID: id,
        },
        data: {
          moviesIDs: {
            push: finalArray,
          },
        },
      });

      res.json({ message: "Movie added to cart successfully", updateCart });
    }
  } else {
    res.status(401).json({
      message: "UnAuthorized - sign in if you have an account or sign up",
    });
  }
}
