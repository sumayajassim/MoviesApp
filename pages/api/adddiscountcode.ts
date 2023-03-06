import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function addDiscount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.token) {
    let userDetails: any = jwtDecode(req.query.token as string);

    if (userDetails.role !== "ADMIN") {
      res.status(401).json({ message: "Not an admin" });
    }

    try {
      const data = await prisma.discount.create({
        data: {
          userID: userDetails.id,
          amount: req.body.amount,
          code: req.body.code,
        },
      });

      res.status(200).json(data);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
