import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import authUser from "@/components/helpers/auth";

export default async function addToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: string = req.headers["authorization"] as string;

  if (!token) {
    res.status(401).send("UnAuthorized - Sign In / Sign Up");
  }
  // any should be changed

  if (req.method !== "POST") {
    res.status(401).send("Not A POST Request");
  }

  const { id } = await authUser(token as string);

  const movies: string[] = req.body.moviesIDs || [];

  const purchased = (
    await prisma.purchases.findMany({
      where: {
        OR: movies.map((movieId) => ({
          moviesIDs: { has: movieId },
        })),
        userID: id,
      },
    })
  ).flatMap(({ moviesIDs }) => moviesIDs);

  const alreadyInCart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  const userMoviesInCart = alreadyInCart.moviesIDs;

  const finalArray = movies.filter(
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
}

// if not token
