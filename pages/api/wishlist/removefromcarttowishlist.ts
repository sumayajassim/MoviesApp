import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function reAdd(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).send("UnAuthorized - Sign in /Sign Up First");
  }

  let userDetails: any = jwtDecode(token as string);
  let movie = req.body.moviesIDs[0];

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  let moviesInCart = cart.moviesIDs;

  if (req.body.moviesIDs) {
    let moviesToBeRemoved = moviesInCart.filter(
      (x, index) => moviesInCart[index] != movie
    );

    await prisma.cart.update({
      where: {
        userID: userDetails.user.id,
      },
      data: {
        moviesIDs: moviesToBeRemoved,
      },
    });

    await prisma.wishlist.update({
      where: {
        userID: userDetails.user.id,
      },
      data: {
        moviesIDs: {
          push: movie,
        },
      },
    });

    res.json({ message: "Added To Wishlist" });
  }
}
