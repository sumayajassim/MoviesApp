import { NextApiRequest , NextApiResponse } from "next";
import axios from "axios";
import {prisma} from '../../../lib/prisma'

export default async function getSimilarMovie(req: NextApiRequest , res: NextApiResponse){
    const {data} = await axios.get(`https://api.themoviedb.org/3/movie/${req.query.movieID}/similar?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1`)

    res.json(data)
}