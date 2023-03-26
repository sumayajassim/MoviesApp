import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token: any = req.headers["authorization"];

  if (!token) {
    res.status(401).send("UnAuthorized");
  }

  let userDetails: any = jwtDecode(token as string);
  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  const balance = await prisma.user.findUniqueOrThrow({
    where: {
      id: userDetails.user.id,
    },
  });

  res.json({
    userCart: cart.moviesIDs,
    userBalance: balance.balance,
  });
}

// change file name to index // no token / data directly inside res.json
