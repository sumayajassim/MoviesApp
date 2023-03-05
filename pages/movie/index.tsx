import React , {useState} from 'react'
import Navbar from '@/components/Navbar'
import { useQueryClient , useQuery } from '@tanstack/react-query'
import axios from 'axios'
import PageNavigation from '@/components/PageNavigation';




function index(props:any) {

  const [page , setPage] = useState(1)

const queryClient = useQueryClient();

const {error , isLoading , data} = useQuery<Data>({
  queryKey: ['movies'],
  queryFn: async () => await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=010b85a5594b639d99d3ea642bd45c74&language=en-US&sort_by=original_title.asc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`)
})

console.log(data)

if (isLoading) return 'Loading...'

if (error) return 'An error has occurred: ' + error?.message

  return (
    
    <div>
      <Navbar isAuth={props.isAuth}/>
      <h1 className='text-6xl text-red-700 px-3 py-2'>All Movies</h1>
      <div className='grid grid-rows-5 grid-flow-col-dense gap-20 justify-center'>
        {data?.data?.results?.map((movies:any) => (
          <>
          <div className='flex flex-col h-72 w-60 gap-y-2 gap-x-2 bg-red-900 m-3 shadow-xl rounded'>
            <img className='rounded bg-fit h-80 w-60' src={`https://image.tmdb.org/t/p/original/${movies.poster_path}`} alt="" />

            <div className="absolute bottom-0 bg-white w-60 h-20 rounded-br-md rounded-bl-md p-4 flex justify-between">
              <p>{movies.title}</p>
            </div>
          
            
              {/* <p>{movies.id}</p>
              <p>{movies.release_date}</p> */}
          </div>
          </>
        ))}
      </div>
      <br />
      <div className='flex w-screen justify-center align-center gap-7 py-4'>
        <p className='text-red-900 p-1 cursor-pointer' onClick={() => setPage(page-1)}>Previos Page</p>
        <p className='text-red-900 p-1 cursor-default'>Page {page}</p>
        <p className='text-red-900 p-1 cursor-pointer' onClick={() => setPage(page+1)}>Next Page</p>
    </div>
    </div>
  )
}

export default index