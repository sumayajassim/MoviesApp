import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import authUser from "@/helpers/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ message: "UnAuthorized" });
  }

  if (req.method !== "POST") {
    res.status(400).json({ message: "Not A POST Request" });
  }

  const { id } = await authUser(token as string);

  const { movieId } = req.body;

  const purchased = await prisma.purchases.findMany({
    where: {
      userID: id,
      moviesIDs: { has: movieId },
    },
  });

  if (purchased.length > 0) {
    res.status(400).json({ message: "Movie Already Purchased" });
  } else {
    await prisma.wishlist.update({
      where: {
        userID: id,
      },
      data: {
        moviesIDs: {
          push: movieId,
        },
      },
    });

    res.json({ message: "Added to Wishlist" });
  }
}
