import axios from "axios";
const API_KEY = process.env.API_KEY;

export default async function getMoviesWithPrices(
  pageNumber: number,
  genreId: number
) {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=original_title.asc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate&with_genres=${genreId}`
    );
    return data;
  } catch {
    return null;
  }
}
