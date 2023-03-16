import Navbar from "@/components/Navbar";
import HomePage from "@/components/HomePage";
import React, { useContext, useState, useEffect } from "react";
// import Script from "next/script";
// import Head from "next/head";
// import Link from "next/link";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";

function App() {
  // const queryClient = useQueryClient();
  // const context = useContext(Context);
  // let token: string = "";
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     token = localStorage.getItem("token");
  //     if (token) {
  //       axios
  //         .get("/api/user/details", {
  //           headers: { Authorization: token },
  //         })
  //         .then((res) => {
  //           context.setData(res.data);
  //         });
  //     } else {
  //       console.log("token is not available");
  //     }
  //   } else {
  //     console.log("no token for you ");
  //   }
  // }, [token]);

  return (
    <>
      <HomePage />
    </>
  );
}

export default App;
