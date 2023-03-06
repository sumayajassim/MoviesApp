import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import AppContext from "../context/context"
import { useState } from 'react';
import Navbar from '@/components/Navbar';


export default function App({ Component, pageProps }: AppProps) {
  const [isAuth, setIsAuth] = useState(false)
  const queryClient = new QueryClient() 
  return <> 
  <AppContext.Provider value={{isAuth,setIsAuth }}>
    <QueryClientProvider client={queryClient}>
        <Navbar/>
        <Component {...pageProps} />
        <ToastContainer />
         <ReactQueryDevtools initialIsOpen={true} />

      </QueryClientProvider>
  </AppContext.Provider>
  </> 
}
