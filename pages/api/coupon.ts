import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function coupon(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    res.status(400).json({ message: "Not A GET Request" });
  }

  const { code } = req.body;

  const coupon = await prisma.discount.findFirst({
    where: {
      code,
    },
  });

  if (!coupon) {
    res.status(404).json({ message: "Coupon is invalid!" });
  }

  res.json({
    discountPercentage: coupon?.amount,
  });
}
