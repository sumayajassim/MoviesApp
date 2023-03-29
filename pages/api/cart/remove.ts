import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import authUser from "@/helpers/auth";

export default async function removeFromCart(
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

  const { movieId } = req.body;

  const { moviesIDs } = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  moviesIDs.filter((cartMovie) => cartMovie !== movieId);

  res.json({ message: "Movie Removed" });
}
