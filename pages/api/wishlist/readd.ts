import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

// //// this should be named better

export default async function reAdd(req: NextApiRequest, res: NextApiResponse) {
  let token = req.headers["authorization"];

  if (token) {
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

      // //// assigning to a variable is not needed here
      const updateCart = await prisma.cart.update({
        where: {
          userID: userDetails.user.id,
        },
        data: {
          moviesIDs: moviesToBeRemoved,
        },
      });

      // //// assigning to a variable is not needed here
      const updateWishlist = await prisma.wishlist.update({
        where: {
          userID: userDetails.user.id,
        },
        data: {
          moviesIDs: {
            push: movie,
          },
        },
      });

      res.json({message: "Added To Wishlist"});
    }
  }
}
