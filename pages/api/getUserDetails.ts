import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import axios, { AxiosResponse } from "axios";
import jwtDecode from "jwt-decode";
import getMovie from "@/components/helpers/getmovie";

// //// very messy code. This should be cleaned up. Remove the comments that are not needed.
export default async function getUserDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = req.headers["authorization"];
  const API_KEY = process.env.API_KEY;
  if (token) {
    let userDetails: any = jwtDecode(token as string);
    const id = userDetails.user.id;
    // console.log({ userDetails });

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    res.json(user);

    //   if (user) {
    //     const wishlistMovies: any = await Promise.all(
    //       user.wishlist!.moviesIDs.map(async (id) => await getMovie(id))
    //     );
    //     const cartMovies: any = await Promise.all(
    //       user.cart!.moviesIDs.map(async (id) => await getMovie(id))
    //     );
    //     res.json({
    //       wishlist: wishlistMovies.filter(Boolean),
    //       cart: cartMovies.filter(Boolean),
    //       user,
    //     });
    //   } else {
    //     res.status(404).json("Something wrong happened");
    //   }

    //   const purchasedMovies = await prisma.purchases.findUniqueOrThrow({
    //     where: {
    //       userID: id,
    //     },
    //   });

    //   console.log(purchasedMovies);
    // }
  }
}
