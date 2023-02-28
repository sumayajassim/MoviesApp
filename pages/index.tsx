import Navbar from '@/components/Navbar'
import React from 'react'
import Script from 'next/script'
import Head from "next/head";


function App() {
  return (
    <>
    <Head>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css" rel="stylesheet" />
      <script defer src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.js"></script>
    </Head>
    <Navbar isAuth={false}/>
    
    </>
   
  )
}

export default App