import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import authUser from "@/helpers/auth";

export default async function removeFromeCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: string = req.headers["authorization"] as string;

  if (!token) {
    res.status(401).send("UnAuthorized");
  }

  if (req.method !== "POST") {
    res.status(401).send("Not A POST Request");
  }

  const { id } = await authUser(token);

  const { movie } = req.body;

  const { moviesIDs } = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  const cartAfterRemovingMovie = moviesIDs.filter(
    (cartMovie) => cartMovie !== movie
  );

  await prisma.cart.update({
    where: {
      userID: id,
    },
    data: {
      moviesIDs: cartAfterRemovingMovie,
    },
  });

  res.send("Movie Removed");
}
