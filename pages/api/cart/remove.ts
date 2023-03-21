import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

// //// typo in the endpoint name. Use an extension called SpellChecker to catch these.
export default async function removeFromeCart(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // //// the token should of type string | undefined, not any.
  const token: any = req.headers["authorization"];

  if (token) {
    let userDetails: any = jwtDecode(token as string);

    const {moviesIDs} = await prisma.cart.findUniqueOrThrow({
      where:{
        userID: userDetails.user.id
      }
    })

    res.json(moviesIDs)

    // //// bad variable name. Use a name that describes what it is.
    const updatedArray = moviesIDs.filter((x:any) => !req.body.moviesIDs.includes(x))

    await prisma.cart.update({
      where:{
        userID: userDetails.user.id
      },
      data:{
        moviesIDs : updatedArray
      }
    })

    // //// the return type of this endpoint is not a json
    res.json("Movie Removed")

    
  }
      
}
