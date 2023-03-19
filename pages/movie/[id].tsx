import React, { useEffect } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { Movie } from "@/types";
import { parseISO, format } from "date-fns";
import addToWishList from "../api/wishlist/add";
import dayjs from "dayjs";

function Movie({}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = router.query;
  console.log({ id });

  const { data: movie } = useQuery<{ data?: Movie }>({
    queryKey: ["movie", id],
    queryFn: () =>
      axios.get(`/api/movie/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      }),
    enabled: !!id,
  });

  const genres = movie?.data.genres.map((genre, index) => (
    <span className="font-semibold">
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

  const {
    data: handleAddToWishlist,
    mutate: addToWishlist,
    isLoading: handleAddWishlistLoading,
  } = useMutation({
    mutationFn: (movieID: any) =>
      axios.post(
        "/api/wishlist/add",
        { moviesIDs: [movieID.toString()] },
        { headers: { Authorization: localStorage.getItem("token") } }
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["movie"]);
      toast.success(res.data.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error(`${err?.response?.data?.message}`, {
        toastId: 1,
      });
    },
  });

  const {
    data: HandelAddToCart,
    mutate: addToCart,
    isLoading: handleAddToCartLoading,
  } = useMutation({
    mutationFn: (movieID: any) =>
      axios.post(
        "/api/cart/add",
        { moviesIDs: [movieID.toString()] },
        { headers: { Authorization: localStorage.getItem("token") } }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["userDetails"]);
      toast.success("Movie Added successfully to your cart");
    },
    onError: (err) => {
      console.log(err);
      toast.error(`${err?.response?.data?.message}`);
    },
  });

  const { mutate: removeFromWishlist, isLoading: removeHandlerLoading } =
    useMutation({
      mutationFn: (movieID: any) =>
        axios.post(
          "/api/wishlist/remove",
          { moviesIDs: [movieID.toString()] },
          { headers: { Authorization: localStorage.getItem("token") } }
        ),
      onSuccess: (res, movieID) => {
        queryClient.invalidateQueries(["movie"]);
        toast.success(res.data.message);
      },
    });

  if (!id) return "NOT FOUND - NO ID";

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
        <div className="w-200 h-[calc(100vh-48px)] card-overlay p-10 flex items-center">
          <div className="rounded-lg w-fit flex  flex-col ">
            <div className="text-3xl font-bold text-white flex justify-between">
              <span className="">
                {movie?.data?.title} ({toHoursAndMinutes(movie?.data.runtime)})
              </span>
              <div className="min-w-fit">
                <i className="fa-solid fa-star text-yellow mx-2"></i>
                {movie?.data.vote_average.toPrecision(2)}
              </div>
            </div>
            <p className="text-white p-1">
              {dayjs(movie?.data?.release_date).format("MMM DD, YYYY")} ●{" "}
              <span className="ml-1">{genres}</span>
            </p>
            <p className="text-white py-4 font-semibold">
              {movie?.data?.overview}
            </p>
            <div>
              {movie?.data?.isPurchased ? (
                <button className="btn rounded bg-[rgba(255,255,255,.5)]">
                  <span>
                    <span>Watch now</span>
                    <i className="fa-solid fa-video text-red-700 text-xl ml-1"></i>

                    {/* <i className="fa-solid fa-cart-shopping text-red-600 text-xl ml-1"></i> */}
                  </span>
                </button>
              ) : (
                <>
                  {" "}
                  <span className="text-4xl text-yellow float-right font-bold">
                    ${movie?.data?.price}
                  </span>
                  {movie?.data.inWishlist ? (
                    <button
                      className="btn rounded  bg-[rgba(255,255,255,.5)]"
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(movie?.data?.id);
                      }}
                    >
                      <span>
                        <span>Remove from Wishlist</span>
                        <i className="fa-solid fa-heart text-red-600 text-xl ml-1"></i>
                      </span>
                    </button>
                  ) : (
                    <button
                      className="btn rounded  bg-[rgba(255,255,255,.5)]"
                      onClick={(e) => {
                        e.preventDefault();
                        addToWishlist(movie?.data?.id);
                      }}
                    >
                      <span>
                        <span>Add to Wishlist</span>
                        <i className="fa-regular fa-heart text-red-600 text-xl ml-1"></i>
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => addToCart(movie?.data?.id)}
                    // disabled={!!movie?.data.inCart}
                    className="btn rounded bg-[rgba(255,255,255,.5)] ml-2"
                  >
                    {/* <i class="fa-regular fa-cart-shopping"></i> */}
                    {/* <i class="fa-regular fa-cart"></i> */}
                    <span>
                      <span>Add to Cart</span>
                      <i className="fa-solid fa-cart-shopping text-red-600 text-xl ml-1"></i>
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Movie;
