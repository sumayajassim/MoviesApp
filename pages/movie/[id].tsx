import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

function Movie({}) {
  const router = useRouter();
  const { id = "" } = router.query;
  console.log(id);

  const { data: movie } = useQuery({
    queryKey: ["movie"],
    queryFn: () => axios.get(`/api/movie/details?id=${id}`),
    enabled: !!id,
  });

  console.log("movie", movie);

  if (!id) return "NOT FOUND - NO ID";

  // return null;
  return <div>Heelo movie</div>;
}

export default Movie;
