import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function removeFromeCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];

  if (!token) {
    res.status(401).send("UnAuthorized");
  }

  const userDetails: any = jwtDecode(token as string);

  const { moviesIDs } = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  res.json(moviesIDs);

  const updatedArray = moviesIDs.filter(
    (movie: any) => !req.body.moviesIDs.includes(movie)
  );

  await prisma.cart.update({
    where: {
      userID: userDetails.user.id,
    },
    data: {
      moviesIDs: updatedArray,
    },
  });

  res.json("Movie Removed");
}

//change x to movie in filter / if no token loop / if no token
