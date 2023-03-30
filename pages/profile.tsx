import Movie from "@/components/Movie";
import LoadingSpinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { MovieType, MutationResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

function Purchases() {
  const [balance, setBalance] = useState<number>(0);
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { data: user, isLoading: userDetailsLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () =>
      axios.get("/api/user", {
        headers: { Authorization: token },
      }),
    enabled: !!token,
  });

  const { mutate: addToBalance } = useMutation({
    mutationFn: () =>
      axios.post(
        "/api/addtobalance",
        { balanceToBeAdded: +balance },
        { headers: { Authorization: token } }
      ),
    onError: (err: MutationResponse) => toast.error(err?.response.data.message),
    onSuccess: (res) => {
      queryClient.refetchQueries({
        queryKey: ["userDetails"],
        type: "active",
        exact: true,
      });
      toast.success(res.data.message);
    },
  });

  return (
    <div className="p-12">
      <div className="flex justify-between px-10 pt-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold ">My profile</h1>
          <div>
            <label htmlFor="name">Name: </label>
            <span id="name" className="font-bold">
              {user?.data.user.userName}
            </span>
          </div>
          <div>
            <label htmlFor="email">Email: </label>
            <span id="name" className="font-bold">
              {user?.data.user.email}
            </span>
          </div>
          <div>
            <label htmlFor="email">Balance: </label>
            <span id="name" className="font-bold">
              ${user?.data.user.balance}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <h1 className="text-2xl font-bold">Add to your balance</h1>
          <div>
            <input
              type="text"
              id="addToBalance"
              name="addToBalance"
              onChange={(e) => setBalance(e.target.value)}
              placeholder="Amount to add"
              className="bg-gray-200 appearance-none border-2 w-48 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-none active:border-none focus:border-red-700 rounded-br-none rounded-tr-none"
            />
            <button
              onClick={() => addToBalance()}
              disabled={!balance}
              className="btn btn-red hover:shadow-lg disabled:bg-red-300 disabled:shadow-none active:bg-red-900 ease-linear transition-all duration-150 rounded-bl-none rounded-tl-none"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold pl-10 pt-10">Previously purchased</h1>
      {user?.data.purchases.length > 0 ? (
        <div className="w-fit mx-auto my-auto flex flex-col p-10">
          {userDetailsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid lg:grid-cols-4 gap-4  md:grid-cols-3  sm:grid-cols-1 max-w-fit">
              {user?.data?.purchases.map((movie: MovieType) => (
                <Movie movie={movie} purchased={true} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-10 text-lg text-center italic font-bold text-dark-grey">
          You don't have any movies yet!
        </div>
      )}
    </div>
  );
}

export default Purchases;
