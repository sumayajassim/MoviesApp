import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LandingPage, MovieType } from "@/types";
import Movie from "@/components/Movie";
import LoadingSpinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";

function HomePage() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  type Response = { data: LandingPage[] };

  const query = (): Promise<Response> =>
    axios.get("http://localhost:8000/api/landingpage", {
      headers: { Authorization: token },
    });

  const { data, isLoading } = useQuery<Response, Error>(["categories"], query, {
    refetchOnWindowFocus: false,
  });

  console.log("data", data);
  const loading = !data || isLoading;

  const HomePageContent = data?.data?.map(
    (category) =>
      category.movies && (
        <>
          <div key={category.id}>
            <h1 className="p-7 text-red-700 font-bold text-2xl">
              {category.title}
            </h1>
            <div className="flex flex-row overflow-x-scroll space-x-3 p-5 ">
              {category.movies?.map((movie: MovieType) => (
                <Movie movie={movie} purchased={false} />
              ))}
            </div>
          </div>
        </>
      )
  );

  return (
    <div className="pt-12">
      {isLoading ? (
        <div className="flex w-full h-[calc(100vh-45px)] justify-center items-center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      ) : (
        HomePageContent
      )}
    </div>
  );
}

export default HomePage;
