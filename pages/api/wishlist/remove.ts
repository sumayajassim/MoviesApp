import { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";
import { prisma } from "@/lib/prisma";
import authUser from "@/helpers/auth";

export default async function removeFromWishlist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers["authorization"] as string;

  if (!token) {
    res.status(401).send("UnAuthorized - Sign in /Sign Up First");
  }

  if (req.method !== "POST") {
    res.status(401).send("Not A POST Request");
  }

  const { id } = await authUser(token);

  const { movieId } = req.body;

  const { moviesIDs } = await prisma.wishlist.findUniqueOrThrow({
    where: {
      userID: id,
    },
  });

  if (!moviesIDs.includes(movieId)) {
    res.status(400).json({ message: "Movie Is Already Not In The Wishlist" });
  }

  const wishlistMoviesAfter = moviesIDs.filter(
    (wishlistMovie) => wishlistMovie !== movieId
  );

  await prisma.wishlist.update({
    where: {
      userID: id,
    },
    data: {
      moviesIDs: wishlistMoviesAfter,
    },
  });

  res.json({ message: "Movie Is Removed From Wishlist" });
}
