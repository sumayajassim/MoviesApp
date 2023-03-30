import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import authUser from "@/helpers/auth";

export default async function addToBalance(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json("UnAuthorized");
  }

  if (req.method !== "POST") {
    res.status(401).send("Not A POST Request");
  }

  const { id } = await authUser(token);

  const { balanceToBeAdded } = req.body;

  const { balance } = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      balance: balance + balanceToBeAdded,
    },
  });

  res.json({ message: "Balance Added" });
}
