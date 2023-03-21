// //// this should not be in the components folder.
// //// use camelCase for file names

import axios from "axios";
const API_KEY = process.env.API_KEY;

export default async function getMovie(id: string) {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    );
    return data;
  } catch {
    return null;
  }
}
