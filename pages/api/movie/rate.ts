import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default function movieRate(req: NextApiRequest, res: NextApiResponse) {
  prisma.review
    .findMany({
      where: {
        movieID: req.body.movieID,
      },
    })
    .then((data) => {
      // //// there must be a better (more readable) way to calculate the average
      let totalRate = 0;
      let i = 0;

      for (i; i < data.length; i++) {
        totalRate += data[i].rate;
      }

      res.json(totalRate / i);
    })
    .catch((err) => {
      // //// you should return an error response here
      console.log(err);
    });
}
