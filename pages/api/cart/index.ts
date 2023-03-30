import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import authUser from "@/helpers/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["authorization"] as string;

  if (!token) {
    res.status(401).send("UnAuthorized");
  }

  if (req.method !== "GET") {
    res.status(401).send("Not A GET Request");
  }

  const { id } = await authUser(token);

  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  const balance = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  res.json({
    userCart: cart.moviesIDs,
    userBalance: balance.balance,
  });
}

// change file name to index // no token / data directly inside res.json
