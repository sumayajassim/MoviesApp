import { NextApiRequest , NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";
import isLoggedIn from "../../components/helpers/isLoggedIn"


function addToWishList(req: NextApiRequest , res: NextApiResponse){
        let userDetails:any = jwtDecode(req.headers.authorization  as string)

        prisma.wishlist.update({
            where: {
                userID: userDetails.id
            },
            data : {
                moviesIDs : {
                    push: req.body.movieID
                }
            }
        })
        .then( (data) => {
            res.json(data)
        })
        .catch(err => {
           res.json(err)
        })
}

export default isLoggedIn(addToWishList)
