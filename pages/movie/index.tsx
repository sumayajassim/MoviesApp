import React, { useState, useEffect , useContext} from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Context from "@/context/context";
import MovieComponent from "@/components/MovieComponent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

function index(props: any) {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");


  const context = useContext(Context);
  let token:string = ''
  useEffect(() => {
    if (typeof window !== "undefined") {
       token = localStorage.getItem("token");
       axios.get('/api/getUserDetails' , {headers: {"Authorization" : token }})
       .then((res) => {
          context.setData(res.data)
       })
    }else{
      console.log('no token for you ')
    }
  },[])

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["movies", search, genre],
    queryFn: async ({
      pageParam = 1,
      genreId = genre,
      searchText = search,
    }) => {
      const res = await axios.get(
        `/api/moviespage?page=${pageParam}&search=${searchText}&genre=${genreId}`
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
    queryFn: () => axios.get("/api/genres"),
  });

  console.log("genres", genres);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  console.log("pages", data);

  const changeHandler = (e: any) => {
    setSearch((search) => e.target.value);
  };

  const handleGenre = (e) => {
    setGenre(e.target.value);
  };

  console.log("selected genre", genre);

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
            onChange={changeHandler}
          />
          <div className="flex-1 ml-4">
            <select
              id="genre"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleGenre}
            >
              <option selected>Choose a genre</option>
              {genres?.data?.map((genre) => (
                <option value={genre.id}>{genre.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 max-w-fit">
          {data?.pages?.map((page) => (
            <React.Fragment key={page.page}>
              {page?.results?.map((movie) => (
                <MovieComponent movie={movie} />
              ))}
            </React.Fragment>
          ))}
          <div>
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load Newer"
                : "Nothing more to load"}
            </button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? "Background Updating..."
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;
