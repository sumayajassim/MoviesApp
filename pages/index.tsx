import Navbar from '@/components/Navbar'
import HomePage from '@/components/HomePage'
import React,{useContext, useState, useEffect} from 'react'
import Script from 'next/script'
import Head from "next/head";
import Link from "next/link"
// import { Message_data } from "../context/context";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Context from "@/context/context";


function App() {
  const queryClient = useQueryClient()

 

  return (
    <>
    <Head>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css" rel="stylesheet" />
      <script defer src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.js"></script>
    </Head>
   
    <HomePage/>
    </>
   
  )
}

export default App