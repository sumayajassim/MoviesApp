import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import { prisma } from "../../../lib/prisma";

export default async function test(req: NextApiRequest, res: NextApiResponse) {
  const token: any = req.headers["authorization"] || "";

  const secret: any = process.env.SECRET_KEY;

  const user: any = jwtDecode(token);

  console.log(token);
  console.log(user.data.id);

  if (user) {
    const movies = req.body.moviesIDs;

    const data = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: user.data.id,
      },
    });
    console.log(data);
  }
}
