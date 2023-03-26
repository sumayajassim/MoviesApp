import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { check, body, validationResult } from "express-validator";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) throw Error("Secret key is not provided!");

  check("email").isEmail();
  check(req.body.password).isLength({ min: 3 }),
    console.log(check(req.body.email).isEmail());

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({ errors: errors.array() });
  }
}
