import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import authUser from "@/helpers/auth";
import axios from "axios";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).send("UnAuthorized");
  }

  if (req.method !== "POST") {
    res.status(400).send("Not A POST Request");
  }

  const { id } = await authUser(token as string);

  const { movieId } = req.body;

  const purchased = await prisma.purchases.findMany({
    where: {
      userID: id,
    },
  });

  res.json(purchased);
}
