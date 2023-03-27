import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { MovieType } from "@/types";
import dayjs from "dayjs";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { MutationResponse } from "@/types";

function GetMovie() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = router.query;
  const { token } = useAuth();

  const { data: movie, isLoading: movieLoading } = useQuery<{
    data: MovieType;
  }>({
    queryKey: ["movie", id],
    queryFn: () =>
      axios.get(`/api/movie/${id}`, {
        headers: { Authorization: token },
      }),
    enabled: !!id,
  });

  const genres = movie?.data.genres.map((genre, index) => (
    <span className="font-semibold" key={genre.id}>
      {genre.name} {index !== movie?.data.genres.length - 1 ? ", " : ""}{" "}
    </span>
  ));

  const convertMinutesToHours = (duration: number) => {
    const hours = Math.floor(duration / 60) + dayjs().hour();
    const formattedDuration = dayjs()
      .hour(hours)
      .minute(duration % 60)
      .format("h:mm");
    return formattedDuration;
  };

  const { mutate: addToWishlist, isLoading: handleAddWishlistLoading } =
    useMutation({
      mutationFn: (movieID: any) =>
        axios.post(
          "/api/wishlist/add",
          { moviesIDs: [movieID.toString()] },
          { headers: { Authorization: token } }
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries(["movie"]);
        queryClient.invalidateQueries(["userDetails"]);
        toast.success(res.data.message);
      },
      onError: (err: MutationResponse) => {
        console.log(err);
        toast.error(`${err?.response?.data?.message}`, {
          toastId: 1,
        });
      },
    });

  const { mutate: addToCart, isLoading: handleAddToCartLoading } = useMutation({
    mutationFn: (movieID: any) => {
      return axios.post(
        "/api/cart/add",
        { moviesIDs: [movieID.toString()] },
        { headers: { Authorization: token } }
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["cartDetails"]);
      // queryClient.invalidateQueries(["movie"]);
      toast.success(`${res?.data?.message}`);
    },
    onError: (err: MutationResponse) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    },
  });

  const { mutate: removeFromWishlist, isLoading: removeHandlerLoading } =
    useMutation({
      mutationFn: (movieID: any) =>
        axios.post(
          "/api/wishlist/remove",
          { moviesIDs: [movieID.toString()] },
          { headers: { Authorization: token } }
        ),
      onSuccess: (res, movieID) => {
        queryClient.invalidateQueries(["movie"]);
        toast.success(res.data.message);
      },
    });

  if (!id) return "NOT FOUND - NO ID";
  if (movieLoading)
    return (
      <div className="w-full h-[calc(100vh-45px)] p-14 flex justify-center items-center">
        <Spinner />
      </div>
    );

  return (
    <div>
      <div className="pt-14">
        <div>
          <div
            className="relative w-full h-[calc(100vh-56px)]  content-[''] block bg-no-repeat bg-center bg-cover "
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),url(https://image.tmdb.org/t/p/original${movie?.data?.backdrop_path})`,
            }}
          ></div>

          <div className="w-200 h-[calc(100vh-48px)] absolute top-12 bg-[rgba(255,255,255,0.31)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-10 flex items-center">
            <div className="rounded-lg w-fit flex  flex-col ">
              <div className="text-3xl font-bold text-white flex justify-between">
                <span className="">
                  {movie?.data?.title} (
                  {convertMinutesToHours(movie?.data.runtime || 0)})
                </span>
                <div className="min-w-fit">
                  <i className="fa-solid fa-star text-yellow mx-2"></i>
                  {movie?.data.vote_average.toPrecision(2)}
                </div>
              </div>
              <p className="text-white p-1">
                {dayjs(movie?.data?.release_date).format("MMM DD, YYYY")} ●
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
                    <span className="text-4xl text-yellow float-right font-bold">
                      ${movie?.data?.price}
                    </span>
                    <button
                      className="btn rounded  bg-[rgba(255,255,255,.5)]"
                      onClick={(e) => {
                        movie?.data.inWishlist
                          ? removeFromWishlist(movie?.data?.id)
                          : addToWishlist(movie?.data?.id);
                      }}
                    >
                      <span>
                        <span>
                          {movie?.data.inWishlist
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"}
                        </span>
                        {movie?.data.inWishlist ? (
                          <i className="fa-solid fa-heart text-red-600 text-xl ml-1"></i>
                        ) : (
                          <i className="fa-regular fa-heart text-red-600 text-xl ml-1"></i>
                        )}
                      </span>
                    </button>

                    <button
                      onClick={() => addToCart(movie?.data?.id)}
                      // disabled={!!movie?.data.inCart}
                      className="btn rounded bg-[rgba(255,255,255,.5)] ml-2"
                    >
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
    </div>
  );
}

export default GetMovie;
