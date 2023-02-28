import { NextApiRequest , NextApiResponse } from "next";
import axios from "axios";

export default function sortMovieByRateDes(req: NextApiRequest , res: NextApiResponse){
    axios.get("https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1")
    .then(data => {

// res.json(data.data.results)
        const dataArray: any[] = []
        const dataExist = data?.data?.results?.id

    if(dataExist){
       res.json("true")
    }
    else{
        // for(let i = 0 ; i<= data.data.results.length ; i++){
        //     dataArray.push(dataExist[i].id)
        // }
        res.json("false")
    }
        res.json(dataArray)
        
    })
    .catch(err => {
        console.log(err)
    })
}