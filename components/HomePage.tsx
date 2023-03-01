import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Movie } from "@/types";

function HomePage() {
  const queryClient = useQueryClient();

  // type Data = {
  //   data: {
  //     categories: any[];
  //   };
  // };

  const { data, isLoading } = useQuery<Data>({
    queryKey: ["categories"],
    queryFn: () => axios.get("http://localhost:8000/api/landingpage"),
    initialData: []
  });

  const categoriesTitle = [
    {title:"TRENDING MOVIES", id: 1},
    {title:"POPULAR MOVIES OF ALL THE TIME", id:2},
    {title:"TRENDING TV SHOWS", id:3},
    {title:"POPULAR TV SHOWS OF ALL THE TIME", id:4},
  ];

  console.log('data',data)
  const loading = !data || isLoading;

  if (loading) return <div>Loading</div>;

  const HomePageContent = data?.data?.map((category, index) => (
    <>
      <h1 className="p-7 text-red-700 font-bold text-2xl">
        {categoriesTitle[index]?.title}
      </h1>
      <div className="flex flex-row overflow-x-scroll space-x-3 pl-5 pb-5 pt-5 " key={categoriesTitle[index].id}>
      {category.map((movie) => (
          <div className="h-96 min-w-fit rounded-md relative drop-shadow-md" key={movie.id}>
            <img
              className="h-96 w-60 object-fill rounded-md"
              src="https://picsum.photos/200/300?grayscale"
              alt=""
            />
            <div className="absolute bottom-0 bg-white w-60 h-20 rounded-br-md rounded-bl-md p-4 flex justify-between">
              <span className="text-red-700">{movie.title? movie.title : movie.name}</span>
              <span>{movie.rate}</span>
            </div>
          </div>
      ))}
      </div>
    </>
  ));

  return <div>{HomePageContent}</div>;
}

export default HomePage;
