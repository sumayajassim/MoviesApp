import React , {useState} from 'react'

function PageNavigation() {
    const [page , setPage] = useState(1)

  return (
    <div className='flex w-screen justify-center align-center gap-7 py-4'>
        <p className='text-red-900 p-1 cursor-pointer' onClick={() => setPage(page-1)}>Previos Page</p>
        <p className='text-red-900 p-1 cursor-pointer'>Page {page}</p>
        <p className='text-red-900 p-1 cursor-pointer' onClick={() => setPage(page+1)}>Next Page</p>
    </div>
  )
}

export default PageNavigation