import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../lib/prisma"
import bcrypt from 'bcrypt'

export default function signup(req: NextApiRequest , res: NextApiResponse){

    bcrypt.hash(req.body.password , 10 , function(err ,hash){
         prisma.user.create({data : {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: hash
    }})
    .then(data => {
        res.json({data})
        
    })
    .catch(err => {
        console.log(err)
    })
   
    })
}
