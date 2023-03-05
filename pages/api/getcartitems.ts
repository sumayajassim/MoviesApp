import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let userDetails: any = jwtDecode(req.query.token as string);
  prisma.cart
    .findUniqueOrThrow({
      where: {
        userID: userDetails.id,
      },
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
