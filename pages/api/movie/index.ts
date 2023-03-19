import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_KEY = process.env.API_KEY;
if (!API_KEY) throw Error("API key is not provided!");

export default async function moviePage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pageNumber = req.query.page || 1;
  const searchText = req.query.search;
  const genreId = req.query.genre || null;
  try {
    if (!searchText) {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=original_title.asc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate&with_genres=${genreId}`
      );
      res.json(data);
    } else {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchText}`
      );
      res.json(data);
    }
  } catch (err) {
    res.send(err);
  }
}
