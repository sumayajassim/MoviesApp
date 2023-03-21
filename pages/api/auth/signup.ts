import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) throw Error("Secret key is not provided!");

  // //// there's a much simpler ways to validate the request body. You can use yup or joi. You can also use a middleware like express-validator.
  function validFirstName() {
    // //// you can use a guard clause to reduce nesting. No point in returning true if the condition is not met.
    if (req.body.firstName.length > 3 && req.body.firstName.length < 25) {
      return true;
    } else {
      // //// you should return a 400 status code, not 200.
      res.json({
        message: "First Name Characters Must Be More Than 3 And Less Than 25",
      });
    }
  }

  function validlastName() {
    if (req.body.lastName.length > 3 && req.body.lastName.length < 25) {
      return true;
    } else {
      res.json({
        message: "Last Name Characters Must Be More Than 3 And Less Than 25",
      });
    }
  }

  function validEmail() {
    // //// you can use a regex to validate the email address. This is not a correct way to validate an email address. It will only check if the email address contains a dot.
    if (req.body.emailAddress.includes("@" && ".")) {
      return true;
    } else {
      // //// typo in the message.
      res.json({ message: "Invalid Email Addresse" });
    }
  }

  const specialCharacters =
    "@" || "." || "_" || "!" || "#" || "$" || "&" || "*" || "^";

  function validPassword() {
    if (
      req.body.password.length > 4 &&
      req.body.password.includes(specialCharacters)
    ) {
      return true;
    } else {
      res.json({
        message:
          "Password Must Conatin At Least One Special Character : @,#,$,%,&,* ... etc",
      });
    }
  }

  // //// const valid = validFirstName() && validlastName() && validEmail() && validPassword();
  function valid() {
    if (
      validFirstName() &&
      validlastName() &&
      validEmail() &&
      validPassword()
    ) {
      return true;
    }
  }

  // //// you can use a guard clause to reduce nesting. 
  if (valid()) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      // //// you should use await instead of then. You can also use a try/catch block.
      prisma.user
        .create({
          data: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: hash,
            wishlist: { create: {} },
            cart: { create: {} },
          },
        })
        // //// NEVER use any. The user is already typed as a User type.
        .then((user) => {
          const userPass = user.password;
          const verifired = bcrypt.compare(req.body.password, userPass);

          verifired.then((istrue) => {
            if (istrue && SECRET_KEY) {
              const token = jwt.sign({ user }, SECRET_KEY, {
                expiresIn: 604800,
              });
              //  getUserDetails(data);
              res.json({ token });
            } else {
              res.status(400).json({ message: "Wrong Password" });
            }
          });
        })
        // //// you just assume that the error is a duplicate email address. You should check the error code and return a 500 status code if it's not a duplicate email address.
        .catch((err: any) => {
          res.status(400).json({ message: "Email is already registered " });
        });
    });
  }
}
