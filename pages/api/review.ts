import { NextApiRequest , NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default function review(req: NextApiRequest  ,res: NextApiResponse){
    prisma.review.create({
        data:{
            userID: req.body.userID,
            movieID: req.body.movieID,
            rate: req.body.rate,
            comment: req.body.comment
        }
    })
    .then(() => {
        res.json("Review Added Succesfully")
    })
    .catch(err => {
        console.log(err)
    })
}