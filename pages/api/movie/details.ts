import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function movieDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${req.body.movieID}?api_key=010b85a5594b639d99d3ea642bd45c74`
  );

  //   data.poster_path.map(
  //     (x: string) => "https://image.tmdb.org/t/p/original" + x
  //   );

  res.json(data.poster_path);
}
