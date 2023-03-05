import React from 'react'
import Movie from '@/types' ;


function MovieComponent(props) {
  const {movie} = props
  return (
    <div className="h-96 min-w-fit rounded-md relative drop-shadow-md" key={movie.id} >
    <img
      className="h-96 w-60 object-fill rounded-md"
      src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
      alt=""
    />
    <div className="absolute bottom-0 bg-white w-60 h-20 rounded-br-md rounded-bl-md p-4 flex justify-between">
      <span className="text-red-700">{movie.title? movie.title : movie.name}</span>
      <span>{movie.vote_average}</span>
    </div>
  </div>
  )
}

export default MovieComponent