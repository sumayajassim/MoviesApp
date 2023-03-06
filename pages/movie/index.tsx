import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import PageNavigation from "@/components/PageNavigation";
import MovieComponent from "@/components/MovieComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from 'react-intersection-observer'
function index(props: any) {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();
  const [search, setSearch] = useState('')
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["movies"],
    queryFn : async ({ pageParam = 1 }) => {
      const res = await axios.get('/api/moviespage?page=' + pageParam)
      return res.data
    },
    getNextPageParam: (lastPage,pages) => pages.length + 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  console.log("pages", data);
  
  const changeHandler = (e:any) => {
    setSearch(search => e.target.value)
    console.log(search)
  }

  return (
    <div>
      <Navbar isAuth={props.isAuth} />
      <div>
          <input type="text" name="searchBar" id="searchBar" onChange={changeHandler} />
        <div className="grid grid-cols-4 gap-4 p-10 max-w-fit mx-auto my-0 justify-center">
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
                ? 'Loading more...'
                : hasNextPage
                ? 'Load Newer'
                : 'Nothing more to load'}
            </button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? 'Background Updating...'
              : null}
          </div>
        </div>
    </div>
    </div>
    
  );
}

export default index;
