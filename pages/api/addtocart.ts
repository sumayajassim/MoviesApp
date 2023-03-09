import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function addToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];

  if (token) {
    let userDetails: any = jwtDecode(token as string);

    const movies = req.body.moviesIDs || [];

    const purchased = (
      await prisma.purchases.findMany({
        where: {
          OR: movies.map((movieId: string) => ({
            moviesIDs: { has: movieId },
          })),
          userID: userDetails.data.id,
        },
      })
    ).flatMap(({ moviesIDs }) => moviesIDs);

    const alreadyInCart = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: userDetails.data.id,
      },
    });

    let userMoviesInCart = alreadyInCart.moviesIDs;

    let finalArray = movies.filter(
      (x: any) => !purchased.includes(x) && !userMoviesInCart.includes(x)
    );

    const updateCart = await prisma.cart.update({
      where: {
        userID: userDetails.data.id,
      },
      data: {
        moviesIDs: {
          push: finalArray,
        },
      },
    });

    if (updateCart) {
      // res.json(updateCart);
      res.status(200).json("movies added to cart");
    } else {
      res.status(401).json("movies already bought or in cart");
    }

    // console.log(movies, "sent movies Array");

    // console.log(purchased, "purchased Array");

    // console.log(userMoviesInCart, "user cart Array");

    // console.log(finalArray, "final Array");
  }
}