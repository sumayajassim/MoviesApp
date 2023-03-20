import jwtDecode from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  if (!req.headers["authorization"]) {
    res.json("unaothroxies");
  }

  const userDetails: any = jwtDecode(req.headers["authorization"] as string);

  const { moviesIDs } = await prisma.wishlist.findUniqueOrThrow({
    where: {
      userID: userDetails.user.id,
    },
  });

  const finalArray = moviesIDs.filter(
    (x: any) => !req.body.moviesIDs.includes(x)
  );

  res.json(finalArray);
}
