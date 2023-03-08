import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";
import isLoggedIn from "../../components/helpers/isLoggedIn"

async function addToWishList(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.token) {
    let userDetails: any = jwtDecode(req.query.token as string);

    const movies = req.body.moviesIDs;

    const purchased = await prisma.purchases.findMany({
      where: {
        userID: userDetails.id,
        OR: movies.map((movieId: string) => ({
          moviesIDs: { has: movieId },
        })),
      },
    });

    const purchasedMovies = purchased.flatMap(({ moviesIDs }) => moviesIDs);

    const cart = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: userDetails.id,
      },
    });

    const moviesInCart = cart.moviesIDs;

    const wishlist = await prisma.wishlist.findUniqueOrThrow({
      where: {
        userID: userDetails.id,
      },
    });

    const moviesInWishList = wishlist.moviesIDs;

    const finalArray = movies.filter(
      (x: any) =>
        !purchasedMovies.includes(x) &&
        !moviesInCart.includes(x) &&
        !moviesInWishList.includes(x)
    );

    const canBeAddedtoWishlist = !finalArray;

    console.log(finalArray);
    console.log(!canBeAddedtoWishlist);

    if (!canBeAddedtoWishlist) {
      const update = await prisma.wishlist.update({
        where: {
          userID: userDetails.id,
        },
        data: {
          moviesIDs: finalArray,
        },
      });

      res.json(update);
    }
  }
}

export default isLoggedIn(addToWishList)
