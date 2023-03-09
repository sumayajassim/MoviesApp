import { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";
import { prisma } from "../../lib/prisma";

export default async function addToBalance(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.token) {
    let userDetails: any = jwtDecode(req.query.token as string);

    const addBalance = await prisma.user.update({
      where: {
        id: userDetails.id,
      },
      data: {
        balance: req.body.addBalance + 100,
      },
    });

    res.json(addBalance);
  }
}
