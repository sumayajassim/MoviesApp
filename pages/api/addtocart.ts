import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";
import index from "../movie";

export default async function addToCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.token) {
    let userDetails: any = jwtDecode(req.query.token as string);

    prisma.cart
      .findUniqueOrThrow({
        where: {
          userID: userDetails.id,
        },
      })
      .then((data) => {
        let userCart: any[] = data?.movieIDs;
        let i = 0;

        for (i; i < req.body.movieIDs.length; i++) {
          if (userCart.includes(req.body.movieIDs[i])) {
            console.log();
          } else {
            userCart.push(req.body.movieIDs[i]);
          }
          //   console.log(req.body.movieIDs[i]);
        }

        prisma.cart
          .update({
            where: {
              userID: userDetails.id,
            },
            data: {
              movieIDs: userCart,
            },
          })
          .then((data) => {
            res.json(data);
            // res.json("added to cart")
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
