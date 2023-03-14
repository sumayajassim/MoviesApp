import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { Movie } from "@/types";

function Movie({}) {
  const router = useRouter();
  const { id = "" } = router.query;
  console.log(id);

  const { data: movie } = useQuery<Movie>({
    queryKey: ["movie"],
    queryFn: () => axios.get(`/api/movie/${id}`),
    enabled: !!id,
  });

  console.log("movie", movie?.data);

  if (!id) return "NOT FOUND - NO ID";

  // return null;
  return (
    <div className="pt-12">
      <div>
        <img
          src={
            `https://image.tmdb.org/t/p/original/${movie?.data.backdrop_path}` ||
            "https://www.altavod.com/assets/images/poster-placeholder.png"
          }
          alt=""
          className="w-full"
        />
      </div>
    </div>
  );
}

export default Movie;
