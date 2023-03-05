import { NextApiRequest  ,NextApiResponse } from "next";
import {prisma} from '../../lib/prisma'
import jwtDecode from "jwt-decode";

export default async function previousPurchases(req: NextApiRequest , res:NextApiResponse){
    if(req.query.token){
        let userDetails:any = jwtDecode(req.query.token as string)
   await prisma.purchases.findMany({
        where:{
            userID: userDetails.id
        }
    })
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        console.log(err)
    })
}}