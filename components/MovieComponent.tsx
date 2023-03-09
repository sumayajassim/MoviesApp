import React from 'react'
import Movie from '@/types' ;
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';


function MovieComponent(props) {
  const {movie} = props

  const { mutate: handleLikeClick, isLoading: handleSubmitTodoLoading } =
  useMutation({
    mutationFn: (movieID: string) => axios.post('/api/createwishlist', {movieID}, {headers: {"Authorization" : localStorage.getItem("token") }}),
    onSuccess: () =>{ console.log("Success")},
  })
  return (
    <div className="h-96 min-w-fit max-w-fit rounded-md relative drop-shadow-md" key={movie.id} >
    <img
      className="h-96 w-60 object-fill rounded-md"
      src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : 'https://www.altavod.com/assets/images/poster-placeholder.png'}
      alt=""
    />
    <div className="absolute bottom-0 bg-white w-60 h-20 rounded-br-md rounded-bl-md p-4 flex justify-between">
      <span className="text-red-700">{movie.title? movie.title : movie.name}</span>
      <span>{movie.vote_average}</span>
    </div>
    <div className="absolute bottom-0 bg-red w-60 h-10 rounded-br-md rounded-bl-md p-4 flex justify-between">
      {/* <span className="text-red-700"></span> */}
      {/* <span>{movie.vote_average}</span> */}
      <button className='' onClick={() => handleLikeClick(movie.id)}>Add</button>
    </div>
  </div>
  )
}

export default MovieComponent