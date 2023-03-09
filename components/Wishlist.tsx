import React,{useContext} from 'react'
import Context from "@/context/context";

function Wishlist() {
  const {data} = useContext(Context);
  console.log('wishlist', data)

  const wishlistItems = data.wishlist.map((movie) => 
    <li key={movie.id} className="flex p-4 items-center justify-between">
        <div className='flex items-center'>
          <img className='h-20 w-20 object-fill rounded-md mr-4' src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : 'https://www.altavod.com/assets/images/poster-placeholder.png'}/>
          <span className='truncate w-56'>{movie.title}</span>
        </div>
        <div className='flex space-x-4'>
        <i className="fa-solid fa-heart"></i>
        <i className="fa-solid fa-cart-plus"></i>
        </div>
    </li>
  )
  return (
    <div className="z-50 w-110 absolute top-12 right-20 mt-1 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 overflow-auto max-h-128">
        {wishlistItems}
    </div>
  )
}

export default Wishlist