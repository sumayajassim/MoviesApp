import React, { useState, useEffect } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Movie from "@/components/Movie";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "use-debounce";
import { useAuth } from "@/context/auth";
import Spinner from "@/components/Spinner";
import { Genre, MovieType } from "@/types";

function index() {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [value] = useDebounce(search, 1000);
  const { token } = useAuth();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["movies", value, genre],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await axios.get(
          `/api/movie?page=${pageParam}&search=${value}&genre=${genre}`,
          { headers: { Authorization: token } }
        );
        return res.data;
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.total_pages === pages.length) return;
        else return pages.length + 1;
      },
      refetchOnWindowFocus: false,
    });

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => axios.get("/api/movie/genres"),
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className="pt-12">
      <div className="w-fit mx-auto my-auto flex flex-col p-10">
        <div className="w-full pb-5 flex">
          <input
            type="text"
            name="searchBar"
            id="searchBar"
            placeholder="Search for a movie"
            className="w-3/4 bg-gray-100 border-2 border-gray-200 rounded  py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-red-700"
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex-1 ml-4">
            <select
              id="genre"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setGenre(e.target.value)}
            >
              <option selected>Choose a genre</option>
              {genres?.data?.map((genre: Genre) => (
                <option value={genre.id}>{genre.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 max-w-fit">
          {data?.pages
            ?.flatMap(({ results }) => results)
            .map((movie: MovieType) => (
              <Movie key={movie.id} movie={movie} />
            ))}
          <div className="">
            <button
              className="justify-center self-center"
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage || hasNextPage ? (
                <Spinner />
              ) : (
                "Nothing more to load"
              )}
            </button>
          </div>
          <div>{isFetching && !isFetchingNextPage && <Spinner />}</div>
        </div>
      </div>
    </div>
  );
}

export default index;
