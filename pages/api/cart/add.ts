import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import authUser from "../../../helpers/auth";

export default async function addToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: string = req.headers["authorization"] as string;

  if (!token) {
    res.status(401).send("UnAuthorized - Sign In / Sign Up");
  }

  if (req.method !== "POST") {
    res.status(401).send("Not A POST Request");
  }

  const { id } = await authUser(token as string);

  const { movie } = req.body;

  const purchased = (
    await prisma.purchases.findMany({
      where: {
        OR: {
          moviesIDs: { has: movie },
        },
        userID: id,
      },
    })
  ).flatMap(({ moviesIDs }) => moviesIDs);

  const { moviesIDs } = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  if (purchased.length > 0) {
    res.status(400).send("Movie Already Purchased");
  }

  if (moviesIDs.includes(movie)) {
    res.status(400).send("Movie Already In Cart");
  } else if (purchased.length <= 0 && !moviesIDs.includes(movie)) {
    await prisma.cart.update({
      where: {
        userID: id,
      },
      data: {
        moviesIDs: {
          push: movie,
        },
      },
    });

    res.json({ message: "Added to Cart" });
  }
}
