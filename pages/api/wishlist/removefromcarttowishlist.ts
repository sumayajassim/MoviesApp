import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import authUser from "@/helpers/auth";

export default async function reAdd(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).send("UnAuthorized - Sign in /Sign Up First");
  }

  if (req.method !== "POST") {
    res.status(401).send("Not A POST Request");
  }

  const { id } = await authUser(token as string);

  let {movie} = req.body

  const {moviesIDs} = await prisma.cart.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  if(!moviesIDs.includes(movie)){
    res.status(400).send("Movie Is Not In Wishlist")
  }

    let moviesToBeRemoved = moviesIDs.filter(
      (cartMovie) => cartMovie !== movie
    );

    await prisma.cart.update({
      where: {
        userID: id,
      },
      data: {
        moviesIDs: moviesToBeRemoved,
      },
    });

    await prisma.wishlist.update({
      where: {
        userID: id,
      },
      data: {
        moviesIDs: {
          push: movie,
        },
      },
    });

    res.json({ message: "Removed And Added To Wishlist" });
  
}
