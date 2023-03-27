import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function coupon(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const coupon = await prisma.discount.findFirstOrThrow({
      where: {
        code: req.body.code,
      },
    });
    res.status(200).json(coupon);
  } catch (e) {
    res.status(404).json({ message: "Coupon is invalid!" });
  }
}
