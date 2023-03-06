import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Context from "../context/context"
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient() 
  return <> 
  <Context>
    <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ToastContainer />
         <ReactQueryDevtools initialIsOpen={true} />

      </QueryClientProvider>
  </Context>
  </> 
}
