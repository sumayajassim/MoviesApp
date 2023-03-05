import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LandingPage, Movie } from "@/types";

function HomePage() {
  const queryClient = useQueryClient();


  // const { data, isLoading } = useQuery({
  //   queryKey: ["categories"],
  //   queryFn: () => axios.get<{data:LandingPage}>("http://localhost:8000/api/landingpage"),
  //   keepPreviousData: false,
  //   // refetchOnWindowFocus: false,
  //   initialData:[]
  // });

  type Response = {data:LandingPage}

  const query = (): Promise<Response> =>
		axios.get('http://localhost:8000/api/landingpage')

	const { data, isLoading } = useQuery<Response, Error>(
		['categories'],
		query,
    {refetchOnWindowFocus: false}

	)



  console.log('data',data)
  const loading = !data || isLoading;

  if (loading) return <div>Loading</div>;

  const HomePageContent = data?.data?.map(category => (
    <div key={category.id}>
      <h1 className="p-7 text-red-700 font-bold text-2xl">
        {category.title}
      </h1>
      <div className="flex flex-row overflow-x-scroll space-x-3 pl-5 pb-5 pt-5 ">
      {category.movies.map((movie) => (
          <div className="h-96 min-w-fit rounded-md relative drop-shadow-md" key={movie.id} >
            <img
              className="h-96 w-60 object-fill rounded-md"
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt=""
            />
            <div className="absolute bottom-0 bg-white w-60 h-20 rounded-br-md rounded-bl-md p-4 flex justify-between">
              <span className="text-red-700">{movie.title? movie.title : movie.name}</span>
              <span>{movie.vote_average}</span>
            </div>
          </div>
      ))}
      </div>
    </div>
  ));

  return <div>{HomePageContent}</div>;
}

export default HomePage;
