import jwtDecode from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  let userDetails: any = jwtDecode(req.headers["authorization"] as string);

  const purchases = await prisma.purchases.findMany({
    where: {
      userID: userDetails.user.id,
    },
  });

  const purchasedMovies = purchases
    .map((x: any) => x.moviesIDs)
    .flatMap((x: any) => x);

  res.json(purchasedMovies);
}
