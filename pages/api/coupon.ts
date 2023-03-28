import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function coupon(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).json({ message: "Not A POST Request" });
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

  res.status(200).json({
    discountPercentage: coupon?.amount,
  });
}
