import { NextApiRequest , NextApiResponse } from "next";
import { prisma } from "../../lib/prisma"
import jwtDecode from "jwt-decode";

export default function purchase(req: NextApiRequest , res:NextApiResponse){
    
    if(req.query.token){
        const userDetails:any = jwtDecode(req.query.token as string)

        if(req.body.amount >= 1 && req.body.amount <= 5){

   prisma.purchases.create({
        data:{
            moviesIDs: req.body.moviesIDs,
            amount: +req.body.amount,
            user: {
                connect: {
                    id: userDetails.id
                }
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

    }
    