import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function removeFromeCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let userDetails: any = jwtDecode(req.query.token as string);
  let test: any = [];

  await prisma.cart
    .findUniqueOrThrow({
      where: {
        userID: userDetails.id,
      },
    })
    .then((data: any) => {
      test = data.movieIDs;
      //   res.json(test.movieIDs);
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(test);
  let i = 0;

  for (i; i < test.length; i++) {
    if (test[i] == req.body.movieID) {
      test = test.filter((x: any) => x != req.body.movieID);
    }
  }

  await prisma.cart
    .update({
      where: {
        userID: userDetails.id,
      },
      data: {
        movieIDs: test,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
