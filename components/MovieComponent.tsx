import React, { useContext } from "react";
import Movie from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Context from "@/context/context";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function MovieComponent(props) {
  const { movie } = props;
  const router = useRouter();
  const { data, setData } = useContext(Context);

  const queryClient = useQueryClient();

  // console.log("token", localStorage.getItem("token"));
  const { mutate: handleLikeClick, isLoading: handleAddWishlistLoading } =
    useMutation({
      mutationFn: (movieID: any) =>
        axios.post(
          "/api/wishlist/add",
          { moviesIDs: [movieID.toString()] },
          { headers: { Authorization: localStorage.getItem("token") } }
        ),
      onSuccess: (res) => {
        toast.success(res.data.message);
      },
      onError: (err) => {
        console.log(err);
        toast.error(`${err?.response?.data?.message}`, {
          toastId: 1,
        });
      },
    });

  const { mutate: handleAddToCartClick, isLoading: handleAddToCartLoading } =
    useMutation({
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

  const handleMovieClick = (id: string) => {
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
      {/* <Image width={300} height={400}
     src={movie.poster_path ? movie.poster_path : 'https://www.altavod.com/assets/images/poster-placeholder.png'} alt=""/> */}
      <div className="absolute bottom-0 bg-white w-60 h-20 rounded-br-md rounded-bl-md p-4 flex justify-between">
        <span className="text-red-700 truncate w-40">
          {movie.title ? movie.title : movie.name}
        </span>
        <span>
          <i className="fa-solid fa-star text-yellow mr-1"></i>
          {movie.vote_average}
        </span>
      </div>
      <div className="absolute bottom-0 bg-red w-60 h-10 rounded-br-md rounded-bl-md p-4 flex justify-between">
        {/* <span className="text-red-700"></span> */}
        {/* <span>{movie.vote_average}</span> */}
        <button
          className=""
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLikeClick(movie.id);
          }}
        >
          <i className="fa-regular fa-heart"></i>
        </button>
        <button
          className=""
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCartClick(movie.id);
          }}
        >
          <i className="fa-solid fa-cart-plus"></i>
        </button>
      </div>
    </div>
  );
}

export default MovieComponent;
