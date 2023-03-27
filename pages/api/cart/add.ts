import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import authUser from "@/helpers/auth";

export default async function addToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers["authorization"] as string;

  if (!token) {
    res.status(401).json({ message: "UnAuthorized - Sign In / Sign Up" });
  }

  if (req.method !== "POST") {
    res.status(401).json({ message: "Not A POST Request" });
  }

  const { id } = await authUser(token);

  const { movieId } = req.body;

  const purchased = (
    await prisma.purchases.findMany({
      where: {
        OR: {
          moviesIDs: { has: movieId },
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
    res.status(400).json({ message: "Movie Already Purchased" });
  }

  if (moviesIDs.includes(movieId)) {
    res.status(400).json({ message: "Movie Already In Cart" });
  } else if (purchased.length <= 0 && !moviesIDs.includes(movieId)) {
    await prisma.cart.update({
      where: {
        userID: id,
      },
      data: {
        moviesIDs: {
          push: movieId,
        },
      },
    });

    res.json({ message: "Added to Cart" });
  }
}
