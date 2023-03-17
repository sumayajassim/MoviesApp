import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwtDecode from "jwt-decode";
import getMovie from "@/components/helpers/getmovie";
import axios from "axios";

export default async function addtest(req: NextApiRequest , res: NextApiResponse){

  const API_KEY = process.env.API_KEY;

  if (!req.headers["authorization"]) {
    res.json("UnAuthorized");
  }

  const userDetails: any = jwtDecode(req.headers["authorization"] as string);

  const { purchases, balance } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userDetails.user.id,
    },
    include: {
      purchases: true,
    },
  });

  let cartPrice = 0

  const cart = await prisma.cart.findUniqueOrThrow({
    where:{
        userID: userDetails.user.id
    }
  })

  res.json(cart)


}