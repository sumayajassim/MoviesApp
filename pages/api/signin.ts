import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
          const token = jwt.sign({data}, process.env.SECRET_KEY, {
            expiresIn: 604800,
          });

          res.json({token});
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
}
