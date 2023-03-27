import React, { useState } from "react";
import { MovieType, MutationResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "@/context/auth";
function Movie(props: { movie: MovieType }) {
  const { movie } = props;
  const router = useRouter();
  const [isLiked, setLike] = useState<Boolean>(movie?.inWishlist || false);
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: handleLikeClick, isLoading: handleAddWishlistLoading } =
    useMutation({
      mutationFn: (movieID: any) =>
        axios.post(
          "/api/wishlist/add",
          { moviesIDs: [movieID.toString()] },
          { headers: { Authorization: token } }
        ),
      onSuccess: (res) => {
        toast.success(res.data.message);
        setLike((isLiked) => !isLiked);
      },
      onError: (err: MutationResponse) => {
        toast.error(`${err?.response?.data?.message}`, {
          toastId: 1,
        });
      },
    });

  const { mutate: removeHandler, isLoading: removeHandlerLoading } =
    useMutation({
      mutationFn: (movieID: any) =>
        axios.post(
          "/api/wishlist/remove",
          { moviesIDs: [movieID.toString()] },
          { headers: { Authorization: token } }
        ),
      onSuccess: (res, movieID) => {
        setLike((isLiked) => !isLiked);
        toast.success("Movie removed successfully from your wishlist!!");
      },
    });

  const { mutate: handleAddToCartClick, isLoading: handleAddToCartLoading } =
    useMutation({
      mutationFn: (movieID: any) => {
        return axios
          .post(
            "/api/cart/add",
            { moviesIDs: [movieID.toString()] },
            { headers: { Authorization: token } }
          )
          .then((response) => toast.success(`${response?.data?.message}`));
      },
      onError: (err: MutationResponse) => {
        toast.error(`${err?.response?.data?.message}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["cartDetails"]);
      },
    });

  const handleMovieClick = (id: number) => {
    router.push(`movie/${id}`);
  };
  return (
    <div
      className="h-96 min-w-fit max-w-fit rounded-md relative drop-shadow-md"
      key={movie.id}
      onClick={() => handleMovieClick(movie.id)}
    >
      <img
        className="h-96 w-60 object-fill rounded-md"
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
            : "https://www.altavod.com/assets/images/poster-placeholder.png"
        }
        alt=""
      />
      <div className="absolute bottom-0 bg-white w-60 h-20 rounded-br-md rounded-bl-md p-4 flex justify-between">
        <span className="text-red-700 truncate w-40">{movie.title}</span>
        <span>
          <i className="fa-solid fa-star text-yellow mr-1"></i>
          {movie.vote_average.toPrecision(2)}
        </span>
      </div>
      {!movie.isPurchased && (
        <>
          <div className="absolute bottom-1 left-4 text-xl font-bold text-[#C21807]">
            ${movie.price || 5}
          </div>
          <div className="absolute bottom-2 bg-red w-60 h-10 rounded-br-md rounded-bl-md p-4 flex justify-end space-x-3">
            {isLiked ? (
              <button
                className=""
                onClick={(e) => {
                  e.stopPropagation();
                  removeHandler(movie.id);
                }}
              >
                <i className="fa-solid fa-heart text-red-500 text-lg "></i>
              </button>
            ) : (
              <button
                className=""
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeClick(movie.id);
                }}
              >
                <i className="fa-regular fa-heart text-red-500 text-lg"></i>
              </button>
            )}
            <button
              className=""
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCartClick(movie.id);
              }}
            >
              <i className="fa-solid fa-cart-plus text-lg "></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Movie;