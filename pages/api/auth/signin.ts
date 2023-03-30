import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.SECRET_KEY;
  if (!secret) throw Error("Secret key is not provided!");

  if (req.method !== "POST") {
    res.status(401).send("Not A POST Request");
  }

  const { emailAddress, password } = req.body;
  const validEmail = emailAddress.includes("@") && emailAddress.includes(".");

  if (!validEmail) {
    res.status(404).send("Invalid Email Address");
  }

  const user = await prisma.user.findUnique({
    where: {
      emailAddress,
    },
  });

  if (!user) {
    return res.status(404).send("User Not Found");
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    res.status(400).send("Wrong Password");
  }

  res.json({ token: jwt.sign(user.id, secret) });
}
