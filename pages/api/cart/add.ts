import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function addToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];

  if (token) {
    let userDetails: any = jwtDecode(token as string);
    const id = userDetails.user.id;

    const movies: string[] = req.body.moviesIDs || [];

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

    const alreadyInCart = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: userDetails.user.id,
      },
    });

    //not used variable / no array in req.body
    let userMoviesInCart = alreadyInCart.moviesIDs;
    const isInCart = alreadyInCart.moviesIDs.includes(movies[0]);
    const isPurchased = purchased.includes(movies[0]);

    let finalArray = movies.filter(
      (movie) => !purchased.includes(movie) && !userMoviesInCart.includes(movie)
    );

    // req .body should not be an array error code?
    if (purchased.includes(movies[0])) {
      res.status(401).json({ message: "Movie is already purchased" });
    } else if (userMoviesInCart.includes(movies[0])) {
      res.status(401).json({ message: "Movie is already in cart" });
    } else if (
      !purchased.includes(movies[0]) &&
      !userMoviesInCart.includes(movies[0])
    ) {
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

// if not token
