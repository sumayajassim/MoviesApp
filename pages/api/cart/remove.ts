import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";
import authUser from "@/components/helpers/auth";

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

  const { moviesIDs } = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  res.json(moviesIDs);

  const cartAfterRemovingMovie = moviesIDs.filter(
    (movie: any) => !req.body.moviesIDs.includes(movie)
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

//change x to movie in filter / if no token loop / if no token
