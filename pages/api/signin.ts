<<<<<<< HEAD
=======
import { wishlist } from "./../../node_modules/.prisma/client/index.d";
>>>>>>> 84d9345d5fa66b0f6e1ad980a9379486d03d8a30
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
<<<<<<< HEAD

export default function signin(req: NextApiRequest, res: NextApiResponse) {
  prisma.user
    .findUniqueOrThrow({
      where: {
        emailAddress: req.body.emailAddress,
      },
    })
    .then((data) => {
      const userPass = data.password;
      const verifired = bcrypt.compare(req.body.password, userPass);

      verifired.then((istrue) => {
        if (istrue && process.env.SECRET_KEY != null) {
          const token = jwt.sign(data, process.env.SECRET_KEY, {
            expiresIn: 604800,
          });

          res.json({ token });
        } else {
          res.status(400).json({ message: "Wrong Password" });
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ message: "User not found" });
      throw err;
      // res.status(404).json({message: `${err.data.message}`})
    });
=======
import axios, { AxiosResponse } from "axios";

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
      emailAddress: req.body.emailAddress,
    },
    include: {
      wishlist: true,
      cart: true,
    },
  });

  if (user) {
    const userPass = user.password;
    const verifired = bcrypt.compare(req.body.password, userPass);

    verifired.then((isMatch: Boolean) => {
      if (!isMatch){ res.status(400).json({ message: "Wrong Password" });}
      else{
          const token = jwt.sign({ user }, SECRET_KEY, { expiresIn: 604800 });
          res.json({ token });
      }
    });

  } else {
    res.status(404).json({ message: "User not found" });
  }
>>>>>>> 84d9345d5fa66b0f6e1ad980a9379486d03d8a30
}
