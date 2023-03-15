import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

export default async function removeFromeCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];

  if (token) {
    let userDetails: any = jwtDecode(token as string);

    const {moviesIDs} = await prisma.cart.findUniqueOrThrow({
      where:{
        userID: userDetails.user.id
      }
    })

    res.json(moviesIDs)

    const updatedArray = moviesIDs.filter((x:any) => !req.body.moviesIDs.includes(x))

    await prisma.cart.update({
      where:{
        userID: userDetails.user.id
      },
      data:{
        moviesIDs : updatedArray
      }
    })

    res.json("Movie Removed")

    
  }
      
}
