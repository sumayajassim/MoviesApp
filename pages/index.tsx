import Navbar from '@/components/Navbar'
import HomePage from '@/components/HomePage'
import React,{useContext, useState, useEffect} from 'react'
import Script from 'next/script'
import Head from "next/head";
import Link from "next/link"
// import { Message_data } from "../context/context";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

function App() {
  const queryClient = useQueryClient()
  // const { message, setMessage } = useContext(Message_data);
  const [isAuth, setIsAuth] = useState(false)

  useEffect(()=> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if(token){
        setIsAuth(true)
      }else{
        setIsAuth(false)
    
      }
    }
  },[])

 

  return (
    <>
    <Head>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css" rel="stylesheet" />
      <script defer src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.js"></script>
    </Head>
    <Navbar isAuth={isAuth}/>
    <HomePage/>
    </>
   
  )
}

export default App