import { NextApiRequest , NextApiResponse } from 'next'
import {prisma} from '../../lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


export default function signin(req: NextApiRequest , res: NextApiResponse){

    prisma.user.findUnique({
        where:{
            emailAddress : req.body.emailAddress
        }
    })
    .then(data => {

        const userPass:any = data?.password
        const  verifired =  bcrypt.compare(req.body.password , userPass)

        verifired.then(istrue => {
            console.log(istrue)

                if(istrue){
                    res.json({data})

                    jwt.sign(data , env.process.SECRET_KEY , {expiresIn: 604800})



                }
                else{
                    res.json({message: "Unverified"})
                }

        })

        // if(!verifired){
        //     res.json({message: "unverified"})
        // }
        // else{
        //     // res.json({data})
        //     res.json({message: "verified"})

        // }
    })
    .catch(err => {
        console.log(err)
    })
}