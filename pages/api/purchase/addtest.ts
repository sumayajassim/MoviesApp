import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwtDecode from "jwt-decode";
import getMovie from "@/components/helpers/getmovie";

export default async function addtest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const API_KEY = process.env.API_KEY;
  const moviesToBePurchased = req.body.movie || null;
  const total = req.body.total || null;
  const discount = req.body.discount;

  let userMistakeArray: any[] = [];
  if (!req.headers["authorization"]) {
    res.json("UnAuthorized");
  }
  if ((req.body.movieIDs.length = 0)) {
    res.json("No Movie's Added!");
  }
  const userDetails: any = jwtDecode(req.headers["authorization"] as string);

  const { purchases } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userDetails.user.id,
    },
    include: {
      purchases: true,
      cart: true,
      wishlist: true,
    },
  });

  if (purchases.length > 0) {
    moviesToBePurchased.map(async (movie: any) => {
      purchases.includes(movie) ? userMistakeArray.push(movie) : console.log();
    });
  }

  res.json({ message: "please remove set movies", userMistakeArray });
}
