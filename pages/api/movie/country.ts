import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function movieCountry(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // //// if the country is not provided, you should return an error otherwise the client will be stuck waiting for the response.
  if (req.body.country) {
    res.json(await fetchData(req.body.country, req.body.page));
  }
}

async function fetchData(req: any, page: any) {
  const { data } = await axios.get(
    // //// does this endpoint even work? 
    `https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&page=${page}&with_original_language=${req}`
  );

  return data.results;
}
