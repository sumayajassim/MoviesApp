import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";
import index from "../movie";

export default async function addToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.token) {
    let userDetails: any = jwtDecode(req.query.token as string);

    const movies = req.body.moviesIDs || [];

    const purchased = (
      await prisma.purchases.findMany({
        where: {
          OR: movies.map((movieId: string) => ({
            moviesIDs: { has: movieId },
          })),
          userID: userDetails.id,
        },
      })
    ).flatMap(({ moviesIDs }) => moviesIDs);

    const alreadyInCart = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: userDetails.id,
      },
    });

    let userMoviesInCart = alreadyInCart.moviesIDs;

    let finalArray = movies.filter(
      (x: any) => !purchased.includes(x) && !userMoviesInCart.includes(x)
    );

    const updateCart = await prisma.cart.update({
      where: {
        userID: userDetails.id,
      },
      data: {
        moviesIDs: finalArray,
      },
    });

    res.json(updateCart);

    // console.log(movies, "sent movies Array");

    // console.log(purchased, "purchased Array");

    // console.log(userMoviesInCart, "user cart Array");

    // console.log(finalArray, "final Array");
  }
}
