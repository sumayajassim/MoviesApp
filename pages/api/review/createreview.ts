import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import jwtDecode from "jwt-decode";

export default function review(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.token) {
    const userDetails: any = jwtDecode(req.query.token as string);
    prisma.review
      .create({
        data: {
          user: { connect: { id: userDetails.id } },
          movieID: req.body.movieID,
          rate: req.body.rate,
          comment: req.body.comment,
        },
      })
      .then(() => {
        res.json("Review Added Succesfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
