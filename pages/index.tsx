import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LandingPage, MovieType } from "@/types";
import LoadingSpinner from "@/components/Spinner";
import Movie from "@/components/Movie";
import { useAuth } from "@/context/auth";

function App() {
  type Response = { data: LandingPage[] };
  const { token } = useAuth();
  console.log({ token });
  const query = (): Promise<Response> =>
    axios.get("/api/landingpage", {
      headers: { Authorization: localStorage.getItem("token") },
    });

  const { data, isLoading } = useQuery<Response, Error>(["categories"], query, {
    refetchOnWindowFocus: false,
  });
  const HomePageContent = data?.data.map((category) => (
    <div key={category.id}>
      <h1 className="p-7 text-red-700 font-bold text-2xl">{category.title}</h1>
      <div className="flex flex-row overflow-x-scroll space-x-3 pl-5 pb-5 pt-5 ">
        {category.movies?.map((movie: MovieType) => (
          <Movie movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  ));

  return (
    <div className="pt-12">
      {isLoading ? (
        <div className="flex w-full h-[calc(100vh-45px)] justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        HomePageContent
      )}
    </div>
  );
}

export default App;
