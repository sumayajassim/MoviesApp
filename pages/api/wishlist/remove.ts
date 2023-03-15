import { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";
import { prisma } from "../../../lib/prisma";

export default async function removeFromWishlist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];

  if (token) {
    let userDetails: any = jwtDecode(token as string);
    // res.json(userDetails.user.wishlist.moviesIDs);
    const movies = req.body.moviesIDs;

    const wishlist = await prisma.wishlist.findUniqueOrThrow({
      where: {
        userID: userDetails.user.id,
      },
    });

    const moviesInWishlist = wishlist.moviesIDs;

    console.log(movies);

    const finalArray = moviesInWishlist.filter((x: any) => !movies.includes(x));
    console.log(finalArray);

    const removeWishList = await prisma.wishlist.update({
      where: {
        userID: userDetails.user.id,
      },
      data: {
        moviesIDs: finalArray,
      },
    });
    res.json(removeWishList);
  }
}
