import { NextApiRequest , NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";
import isLoggedIn from "../../components/helpers/isLoggedIn"


function addToWishList(req: NextApiRequest , res: NextApiResponse){
    // console.log("request", req.user.user.id)
        prisma.wishlist.update({
            where: {
                userID: req.user.user.id
            },
            // data: {push : req.body.movieID}
            data : {
                moviesIDs : {
                    push: req.body.movieID
                }
            }
        })
        .then( (data) => {
            res.json(data)
            console.log('data', data)
        })
        .catch(err => {
           res.json(err)
        })

        // res.send("hello")
}

export default isLoggedIn(addToWishList)
