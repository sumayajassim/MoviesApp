import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import getMovie from "@/components/helpers/getmovie";

export default async function movie(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const movie = await getMovie(id as string);

  res.json(movie);
}
