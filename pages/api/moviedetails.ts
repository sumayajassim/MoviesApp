import { NextApiRequest , NextApiResponse } from "next";
import axios from 'axios'

export default function movieDetails(req: NextApiRequest , res: NextApiResponse){
    const movieID = req?.body?.movieID

    if(movieID){
        axios.get(`https://api.themoviedb.org/3/movie/${movieID}?api_key=010b85a5594b639d99d3ea642bd45c74`)
        .then(data => {
            res.json(data.data)
        })
        .catch(err => {
            console.log(err)
        })
    }
}