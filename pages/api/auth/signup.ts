import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const SECRET_KEY = process.env.SECRET_KEY as string;

  if (!SECRET_KEY) throw Error("Secret key is not provided!");

  if (req.method !== "POST") {
    res.status(401).json({ message: "Not A POST Request" });
  }

  const { firstName, lastName, emailAddress, password } = req.body;
  const salt = parseInt(process.env.SALT as string);
  const validFirstName = firstName.length >= 3 && firstName.length <= 25;
  const validLastName = lastName.length >= 3 && lastName.length <= 25;
  const validEmail = emailAddress.includes("@") && emailAddress.includes(".");

  const validPassword =
    password.length >= 8 &&
    password.length <= 22 &&
    (password.includes("@") ||
      password.includes(".") ||
      password.includes("_") ||
      password.includes("!") ||
      password.includes("#") ||
      password.includes("$") ||
      password.includes("%") ||
      password.includes("^") ||
      password.includes("&") ||
      password.includes("*"));

  const emailExist = await prisma.user.findUnique({
    where: {
      emailAddress: emailAddress,
    },
  });

  if (emailExist) {
    res.status(500).json({ message: "Email Is Already Registered" });
  }

  if (!validFirstName) {
    res.status(400).json({
      message: "First Name Characters Must Be More Than 3 And Less Than 25",
    });
  }

  if (!validLastName) {
    res.status(400).json({
      message: "Last Name Characters Must Be More Than 3 And Less Than 25",
    });
  }

  if (!validEmail) {
    res.status(400).json({ message: "Invalid Email Address" });
  }

  if (!validPassword) {
    res
      .status(400)
      .send(
        "Password Must Contain 8 To 22 Characters With At Least One Special Character : @,#,$,%,&,* ... etc"
      );
  }

  const hashPass = bcrypt.hashSync(password, salt);

  const { id } = await prisma.user.create({
    data: {
      firstName,
      lastName,
      emailAddress,
      password: hashPass,
      wishlist: { create: {} },
      cart: { create: {} },
    },
  });

  res.json({ token: jwt.sign(id, SECRET_KEY) });
}
