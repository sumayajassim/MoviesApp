import { NextApiRequest , NextApiResponse } from "next";
import axios from "axios";

const popularArray: any[] = []
const popularMoviesOfAllTimeArray: any[] = []
const popularTvShowsArray: any[] = []
const popularTvShowsOfAllTimeArray: any[] = []

const landingPageArray: any[] = []

export default function landingpage(req: NextApiRequest , res: NextApiResponse){ 

    trendingMovies()
    popularMoviesOfAllTime()
    popularTvShows()
    popularTvShowsOfAllTime()

    if(popularArray.length > 1 && popularMoviesOfAllTimeArray.length > 1 && popularTvShowsArray.length > 1 && popularTvShowsOfAllTimeArray.length > 1){

    landingPageArray.push(popularArray , popularMoviesOfAllTimeArray, popularTvShowsArray, popularTvShowsOfAllTimeArray)
    res.json(landingPageArray)

    }

    else{
        res.json(false)
    }

}

function trendingMovies(){
    axios.get("https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1")
    .then(data => {

     const dataExist = data?.data?.results

    if(dataExist){

       for(let i = 0 ; i<= 8 ; i++){
           popularArray.push(dataExist[i])
       }
   
    }
    else{
       return
    }

        
    })
    .catch(err => {
        console.log(err)
    })
}

function popularMoviesOfAllTime(){
    axios.get("https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1")
.then(data => {

 const dataExist = data?.data?.results

if(dataExist){

   for(let i = 0 ; i<= 8 ; i++){
    popularMoviesOfAllTimeArray.push(dataExist[i])
   }

}
else{
    return
}
    
})
.catch(err => {
    console.log(err)
})
}


function popularTvShows(){
    axios.get("https://api.themoviedb.org/3/tv/popular?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1")
.then(data => {

 const dataExist = data?.data?.results

if(dataExist){

   for(let i = 0 ; i<= 8 ; i++){
    popularTvShowsArray.push(dataExist[i])
   }

}
else{
    return
}
    
})
.catch(err => {
    console.log(err)
})
}



function popularTvShowsOfAllTime(){
    axios.get("https://api.themoviedb.org/3/tv/top_rated?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&page=1")
.then(data => {

 const dataExist = data?.data?.results

if(dataExist){

   for(let i = 0 ; i<= 8 ; i++){
    popularTvShowsOfAllTimeArray.push(dataExist[i])
   }

}
else{
    return
}
    
})
.catch(err => {
    console.log(err)
})
}