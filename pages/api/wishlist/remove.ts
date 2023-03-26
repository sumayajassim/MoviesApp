import { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";
import { prisma } from "../../../lib/prisma";
import authUser from "@/components/helpers/auth";

export default async function removeFromWishlist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];

  if (!token) {
    res.status(401).send("UnAuthorized - Sign in /Sign Up First");
  }

  if (req.method !== "POST") {
    res.status(401).send("Not A POST Request");
  }

  const { id } = await authUser(token);

  const movies = req.body.moviesIDs;

  const wishlist = await prisma.wishlist.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  const moviesInWishlist = wishlist.moviesIDs;

  const finalArray = moviesInWishlist.filter((x: any) => !movies.includes(x));

  await prisma.wishlist.update({
    where: {
      userID: id,
    },
    data: {
      moviesIDs: finalArray,
    },
  });

  res.json({ message: "Movie Is Removed" });
}
