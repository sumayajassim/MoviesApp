import { NextApiRequest , NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default function(req: NextApiRequest , res: NextApiResponse){
    prisma.wishlist.create({
        data:{
            userID: req.body.userID,
            movieID: req.body.movieID
        }
    })
    .then(data => {

        if(data){
            res.json("Added To Wishlist Succesfuly")
        }
    })
    .catch(err => {
        console.log(err)
    })
}