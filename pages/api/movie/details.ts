import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// //// the endpoint name should be index.ts to call it from /api/movie
export default async function movieDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // //// API key should be stored in an environment variable
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${req.body.movieID}?api_key=010b85a5594b639d99d3ea642bd45c74`
  );

  //   data.poster_path.map(
  //     (x: string) => "https://image.tmdb.org/t/p/original" + x
  //   );

  res.json(data.poster_path);
}
