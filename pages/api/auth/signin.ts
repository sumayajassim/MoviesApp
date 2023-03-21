import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const SECRET_KEY = process.env.SECRET_KEY;
  const API_KEY = process.env.API_KEY;
  if (!SECRET_KEY) throw Error("Secret key is not provided!");
  if (!API_KEY) throw Error("API key is not provided");

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      // //// no validation.. if a user gives a wrong email format, it will still call the database.
      emailAddress: req.body.emailAddress,
    },
    include: {
      // //// the sign in endpoint should not return the user's wishlist and cart. It's only responsible for authentication.
      wishlist: true,
      cart: true,
    },
  });

  // //// too much nesting. You can use a guard clause to reduce the nesting. In fact, the user is always defined (findUniqueOrThrow), so you can just check if the password is correct.
  if (user) {
    const userPass = user.password;
    // //// this is a promise, so you should await it to reduce nesting. Also verifired is not a good name for a variable (and a typo).
    const verifired = bcrypt.compare(req.body.password, userPass);

    verifired.then((isMatch: Boolean) => {
      if (!isMatch) {
        // //// should be 401, unauthorized.
        res.status(400).json({ message: "Wrong Password" });
      } else {
        // //// the user should not be returned in the token. The token should only contain the user's id. The user's data should be fetched from the database when needed.
        const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: 604800 });
        res.json({ token });
      }
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
}
