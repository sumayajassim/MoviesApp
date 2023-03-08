import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY
if(!SECRET_KEY) throw Error('Secret key is not provided!')

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  function validFirstName() {
    if (req.body.firstName.length > 3 && req.body.firstName.length < 25) {
      return true;
    } else {
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
    if (req.body.emailAddress.includes("@" && ".")) {
      return true;
    } else {
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

  if (valid()) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
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
        .then((data) => {
          // res.json({ data })

          const userPass = data.password;
          const verifired = bcrypt.compare(req.body.password, userPass);

          verifired.then((istrue) => {
            if (istrue && SECRET_KEY) {
             getUserDetails(data);
            } else {
              res.status(400).json({ message: "Wrong Password" });
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  async function getUserDetails(user:any){
    const token = jwt.sign({user} , SECRET_KEY, {expiresIn: 604800})
    let wishlist = await prisma.wishlist.findFirstOrThrow({where :{userID:  user.id}, select:{moviesIDs: true }})
    let cart = await prisma.cart.findFirstOrThrow({where :{userID:  user.id}, select: {movieIDs: true}})
    res.json({token, wishlist: wishlist.moviesIDs,cart: cart.movieIDs, user})
}
}
