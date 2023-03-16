import React, { useEffect } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { Movie } from "@/types";
import { parseISO, format } from "date-fns";

function Movie({}) {
  const router = useRouter();
  let formatedDate = "";
  let newRate;
  const { id } = router.query;
  console.log({ id });

  const { data: movie, refetch } = useQuery<Movie>({
    queryKey: ["movie", id],
    queryFn: () => axios.get(`/api/movie/${id}`),
    enabled: !!id,
  });
  console.log("movie", movie);

  if (!id) return "NOT FOUND - NO ID";

  if (movie) {
    const date = Date.parse(`${movie?.data?.release_date} GMT`);
    formatedDate = format(date, "LLLL d, yyyy");
    console.log({ formatedDate });
    newRate = movie?.data.vote_average.toPrecision(2);
  }

  const genres = movie?.data.genres.map((genre, index) => (
    <span>
      {genre.name} {index !== movie?.data.genres.length - 1 ? ", " : ""}{" "}
    </span>
  ));

  function toHoursAndMinutes(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${padToTwoDigits(hours)}h ${padToTwoDigits(minutes)}m`;
  }

  function padToTwoDigits(num) {
    return num.toString().padStart(2);
  }
  return (
    <div>
      <style>{`
      .image-overlay{
        position: relative;
      }
      .image-overlay{
         display: block;
         content: '';
         position: absolute;
         width: 100%;
         height: calc(100vh - 48px);
         background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),url("https://image.tmdb.org/t/p/original${movie?.data?.backdrop_path}");
         background-repeat: no-repeat;
         background-size: cover;
         background-position: center;
      }
      .card-overlay{
        background: rgba(255, 255, 255, 0.31);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(0px);
        -webkit-backdrop-filter: blur(0px);
      }
    
      `}</style>
      <div className="pt-12">
        <div className="image-overlay w-full"></div>
        <div className="w-200 h-[calc(100vh-48px)] card-overlay p-10">
          <div className="text-3xl font-bold text-white flex justify-between">
            <span className="">
              {movie?.data?.title} ({toHoursAndMinutes(movie?.data.runtime)})
            </span>
            <div className="min-w-fit">
              <i className="fa-solid fa-star text-yellow mx-2"></i>
              {newRate}
            </div>
          </div>
          <p className="text-white p-1">
            {formatedDate} ● <span className="ml-1">{genres}</span>
          </p>
          <p className="text-white py-4">{movie?.data?.overview}</p>

          <button>
            {movie?.data.inWishlist ? (
              <i className="fa-solid fa-heart text-red-600"></i>
            ) : (
              <i className="fa-regular fa-heart text-red-600 text-2xl"></i>
            )}
          </button>
          <button disabled={!!movie?.data.inCart}>
            {/* <i class="fa-regular fa-cart-shopping"></i> */}
            {/* <i class="fa-regular fa-cart"></i> */}
            <i class="fa-regular fa-cart-shopping"></i>
            <i className="fa-regular fa-cart-shopping text-white text-2xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Movie;
