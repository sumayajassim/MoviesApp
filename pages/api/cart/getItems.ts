// //// the endpoint name should be index.ts to call it from /api/cart

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token: any = req.headers["authorization"];

  // //// you can use a guard clause to reduce nesting.
  if (token) {
    // //// why is this a let?
    let userDetails: any = jwtDecode(token as string);
    const userCart = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: userDetails.user.id,
      },
    });

    const userBalance = await prisma.user.findUniqueOrThrow({
      where: {
        id: userDetails.user.id,
      },
    });

    // //// should be named cart and balance
    const data = {
      userCart: userCart.moviesIDs,
      userBalance: userBalance.balance,
    };

    res.json(data);
  }
}
