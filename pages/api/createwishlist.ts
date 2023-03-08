import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import isLoggedIn from "../../components/helpers/isLoggedIn";
import axios from "axios";

const API_KEY = process.env.API_KEY
if(!API_KEY) throw Error('...')

async function addToWishList(req: NextApiRequest, res: NextApiResponse) {
  const getMovie = async (id: string) => {
    const {data} = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    return data
  }
  
console.log(req.user.user.id)
    const movies =  req.body.movieID;

    const purchased = await prisma.purchases.findMany({
      where: {
        userID: req.user.user.id,
        OR: movies.map((movieId: string) => ({
          moviesIDs: { has: movieId },
        })),
      },
    });

    const purchasedMovies = purchased.flatMap(({ moviesIDs }) => moviesIDs);

    const cart = await prisma.cart.findUniqueOrThrow({
      where: {
        userID: req.user.user.id,
      },
    });

    const moviesInCart = cart.moviesIDs;

    const wishlist = await prisma.wishlist.findUniqueOrThrow({
      where: {
        userID:req.user.user.id,
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
          userID: req.user.user.id,
        },
        data: {
          moviesIDs: finalArray,
        },
      });

      if(update){
        const movie = await getMovie(req.body.movieID[0])
        res.json({movie});
      }
      else{res.status(400).json({message: "Something wrong happened"})}

    }
  else{
    res.status(400).json({message: "The movie already in your wishlist"})
  }

}

export default isLoggedIn(addToWishList)
