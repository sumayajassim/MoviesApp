import { NextApiRequest , NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwtDecode from "jwt-decode";

export default function(req: NextApiRequest , res: NextApiResponse){
    
    if(req.query.token){
        let userDetails:any = jwtDecode(req.query.token  as string)

        prisma.wishlist.update({
            where: {
                userID: userDetails.id
            },
            data : {
                moviesIDs : {
                    push: req.body.moviesIDs
                }
            }
        })
        .then( (data) => {
            res.json(data)
        })
        .catch(err => {
            console.log(err)
        })
    }
}