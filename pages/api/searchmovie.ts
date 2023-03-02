import { NextApiRequest , NextApiResponse } from "next";
import axios from 'axios'

export default async function(req: NextApiRequest , res: NextApiResponse){

    const movie = req.body.movie.replaceAll(" " , "+")
    res.json(await fetchData(movie))
}

async function fetchData(movie:any) {
    const {data} = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=010b85a5594b639d99d3ea642bd45c74&query=${movie}`)  
    return data.results
}