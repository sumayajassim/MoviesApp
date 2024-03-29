import "../styles/globals.css";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AppContext from "../context/context";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import AuthProvider from "../context/auth";
export default function App({ Component, pageProps }: AppProps) {
  const [data, setData] = useState({});

  const queryClient = new QueryClient();

  const contextValue = {
    data,
    setData,
  };

  return (
    <AuthProvider>
      <AppContext.Provider value={contextValue}>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-right"
            closeButton={false}
            autoClose={1500}
          />
          {/* <ReactQueryDevtools initialIsOpen={true} /> */}
        </QueryClientProvider>
      </AppContext.Provider>
    </AuthProvider>
  );
}
