import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function addToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.token) {
    let userDetails: any = jwtDecode(req.query.token as string);
    // console.log(userDetails);
    prisma.cart
      .update({
        where: {
          userID: userDetails.id,
        },
        data: {
          movieIDs: {
            push: req.body.movieIDs,
          },
        },
      })
      .then((data) => {
        res.json(data);
        // res.json("added to cart")
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
