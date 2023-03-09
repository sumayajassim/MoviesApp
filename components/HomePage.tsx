import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LandingPage, Movie } from "@/types";
import MovieComponent from "./MovieComponent";

function HomePage() {
  const queryClient = useQueryClient();
  type Response = { data: LandingPage };

  const query = (): Promise<Response> =>
    axios.get("http://localhost:8000/api/landingpage");

  const { data, isLoading } = useQuery<Response, Error>(["categories"], query, {
    refetchOnWindowFocus: false,
  });

  console.log("data", data);
  const loading = !data || isLoading;

  if (loading) return <div>Loading</div>;

  const HomePageContent = data?.data?.map((category) => (
   category.movies && <>
    <div key={category.id}>
      <h1 className="p-7 text-red-700 font-bold text-2xl">{category.title}</h1>
      <div className="flex flex-row overflow-x-scroll space-x-3 pl-5 pb-5 pt-5 ">
        {category.movies?.map((movie) => (
          <MovieComponent movie={movie} />
        ))}
      </div>
    </div>
    </>
  ));

  return <div className="pt-12">{HomePageContent}</div>;
}

export default HomePage;
