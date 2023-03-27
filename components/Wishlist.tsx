import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { MovieType, MutationResponse } from "@/types";

function Wishlist() {
  const router = useRouter();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: userDetails, isLoading: userDetailsLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () =>
      axios.get("/api/user", {
        headers: { Authorization: token },
      }),
  });

  const { mutate: handleAddToCartClick, isLoading: handleAddToCartLoading } =
    useMutation({
      mutationFn: (movieID: Number) =>
        axios.post(
          "/api/cart/add",
          { movieId: movieID.toString() },
          { headers: { Authorization: token } }
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries(["userDetails"]);
        toast.success(res.data.message);
      },
      onError: (err: MutationResponse) => {
        toast.error(err?.response?.data?.message);
      },
    });

  const { mutate: removeHandler, isLoading: removeHandlerLoading } =
    useMutation({
      mutationFn: (movieID: Number) =>
        axios.post(
          "/api/wishlist/remove",
          { movieId: movieID.toString() },
          { headers: { Authorization: token } }
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries(["userDetails"]);
        toast.success(res.data.message);
      },
    });

  const wishlistItems = userDetails?.data?.wishlist.map((movie: MovieType) => (
    <li key={movie.id} className="flex p-4 items-center justify-between">
      <div
        className="flex items-center"
        onClick={(e) => {
          router.push(`/movie/${movie.id}`);
        }}
      >
        <img
          className="h-20 w-20 object-fill rounded-md mr-4"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
              : "https://www.altavod.com/assets/images/poster-placeholder.png"
          }
        />
        <span className="truncate w-56">{movie.title}</span>
      </div>
      <div className="flex space-x-4">
        <i
          className="fa-solid fa-heart cursor-pointer hover:text-red-900"
          onClick={(e) => {
            removeHandler(movie.id);
          }}
        ></i>
        <i
          className="fa-solid fa-cart-plus cursor-pointer"
          onClick={(e) => {
            handleAddToCartClick(movie.id);
          }}
        ></i>
      </div>
    </li>
  ));
  if (userDetailsLoading)
    return (
      <div className="z-50 w-110 absolute top-12 right-20 mt-1 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow overflow-auto max-h-128">
        <div className="flex items-center justify-center min-w-110 p-5">
          <LoadingSpinner />
        </div>
      </div>
    );

  return (
    <div className="z-50 w-110 absolute top-12 right-20 mt-1 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow overflow-auto max-h-128">
      {userDetails?.data?.wishlist.length > 0 ? (
        wishlistItems
      ) : (
        <p className="min-w-110 p-5 text-dark-grey">
          You have nothing in your wishlist
        </p>
      )}
    </div>
  );
}

export default Wishlist;
