import MovieComponent from "@/components/MovieComponent";
import Spinner from "@/components/spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

function Purchases() {
  const queryClient = useQueryClient();
  const { data: userDetails, isLoading: userDetailsLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () =>
      axios.get("/api/user/details", {
        headers: { Authorization: localStorage.getItem("token") },
      }),
  });
  return (
    <div className="p-12">
      <h1 className="text-2xl font-bold pl-10 pt-10">Previously purchased</h1>
      <div className="w-fit mx-auto my-auto flex flex-col p-10">
        {userDetailsLoading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-4 gap-4 max-w-fit">
            {userDetails?.data?.purchases.map((movie) => (
              <MovieComponent movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Purchases;
