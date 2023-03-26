import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

export default async function signIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) throw Error("Secret key is not provided!");

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        emailAddress: req.body.emailAddress,
      },
    });

    const userPass = user.password;
    const isMatched = bcrypt.compare(req.body.password, userPass);

    isMatched.then((isMatch: Boolean) => {
      if (!isMatch) {
        res.status(400).json({ message: "Wrong Password" });
      } else {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, {
          expiresIn: 604800,
        });
        res.json({ token });
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
    throw error;
  }
}
