import { NextApiRequest , NextApiResponse } from "next";
import jwtDecode from "jwt-decode";
import {prisma} from '../../lib/prisma'

export default async function removeFromWishlist(req:NextApiRequest , res: NextApiResponse) {
    if(req.query.token){
        const userDetails:any = jwtDecode(req.query.token as string)
        const movies = req.body.moviesIDs

        const wishlist = await prisma.wishlist.findUniqueOrThrow({
            where:{
                userID: userDetails.id
            }
        })

      const moviesInWishlist = wishlist.moviesIDs


        const finalArray = movies.filter((x:any) => !moviesInWishlist.includes(x))

        console.log(finalArray)



    }
}