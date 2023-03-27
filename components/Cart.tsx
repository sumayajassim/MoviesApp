import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "@/context/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MovieType, MutationResponse } from "@/types";

export default function Modal(props: {
  showModal: boolean;
  setShowModal: any;
}) {
  const { showModal, setShowModal } = props;
  const router = useRouter();
  const [discount, setDiscount] = useState(false);
  const [coupon, setCoupon] = useState("");
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: userDetails } = useQuery(
    ["cartDetails"],
    () =>
      axios.get("/api/user", {
        headers: { Authorization: token },
      }),
    { enabled: !!token }
  );
  const totalPrice: number = userDetails?.data.cart?.reduce(
    (total: number, item: MovieType) => total + item.price,
    0
  );
  let finalPrice = totalPrice;

  const { mutate: handelRemoveFromCart } = useMutation({
    mutationFn: (movieID: number) => {
      return axios.post(
        "/api/cart/remove",
        { movieId: movieID.toString() },
        { headers: { Authorization: token } }
      );
    },
    onError: (err: MutationResponse) => {
      toast.error(err.data.message);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["cartDetails"]);
      toast.success(res.data.message);
    },
  });
  const { mutate: handelCheckout } = useMutation({
    mutationFn: (confirm: boolean) =>
      axios.post(
        "/api/purchase/add",
        { confirm, cartPrice: finalPrice },
        { headers: { Authorization: token } }
      ),
    onError: (err: MutationResponse) => toast.error(err?.data.message),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["cartDetails"]);
      toast.success(res.data.message);
    },
  });

  const { data: discountData, mutate: handleDiscount } = useMutation({
    mutationFn: (confirm: boolean) =>
      axios.post(
        "/api/purchase/add",
        { confirm, cartPrice: totalPrice, code: coupon },
        { headers: { Authorization: token } }
      ),
    onError: (err: MutationResponse) => toast.error(err?.data.message),
    onSuccess: (res) => {
      console.log({ coupon });
      if (coupon) {
        setDiscount((discount) => !discount);
        finalPrice = res.data.total;
      }
      queryClient.invalidateQueries(["userDetails"]);
      toast.success(res.data.message);
    },
  });

  const cartItems = userDetails?.data.cart?.map((item: MovieType) => (
    <li
      key={item.id}
      className="border-t-1 border-b-1 list-none py-4 px-8 flex items-center"
    >
      <div
        className="flex flex-row cursor-pointer"
        onClick={() => {
          router.push(`/movie/${item.id}`);
          setShowModal(false);
        }}
      >
        <img
          className="w-20 h-32 drop-shadow-lg rounded"
          src={
            item.poster_path
              ? `https://image.tmdb.org/t/p/original/${item.poster_path}`
              : "https://www.altavod.com/assets/images/poster-placeholder.png"
          }
          alt=""
        />
        <div className="flex flex-col ml-4 items">
          <span className="text-black font-semibold">{item.title}</span>
          <div className="flex flex-wrap w-72">
            {item.genres?.map((genre) => (
              <span className="w-fit font mt-1 mr-1 px-1 py-0 rounded-lg bg-red-700 text-white font-semibold text-xs">
                {genre.name}
              </span>
            ))}
          </div>
          <div className=""></div>
        </div>
      </div>
      <span className="flex flex-col text-2xl font-bold grow items-end">
        ${item.price || 5}
        <button
          onClick={(e) => {
            handelRemoveFromCart(item.id);
          }}
        >
          <i className="fa-solid fa-trash text-red-500 text-xl pl-0"></i>
        </button>
      </span>
    </li>
  ));

  if (!showModal) return null;
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-non box">
        <div className="relative  my-6 mx-auto min-w-[50rem] ">
          <div className="border-0 rounded-lg shadow-lg  relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-3  shadow-md border-solid rounded-t">
              <h3 className="text-3xl font-semibold">
                <i className="fa-solid fa-cart"></i> Cart
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="text-black">
                  <i className="fa-sharp fa-solid fa-xmark"></i>
                </span>
              </button>
            </div>
            <div className="relative p-0 flex-auto overflow-auto max-h-[50vh] min-h-[50vh] max-w-4xl min-w-[60%]">
              {cartItems?.length > 0 ? (
                cartItems
              ) : (
                <div className="p-5 w-72 h-44">Your cart is empty</div>
              )}
            </div>
            {cartItems?.length > 0 && (
              <div className="flex flex-col items-end justify-center p-6 border-solid rounded-b">
                <div className="flex items-center self-center">
                  <input
                    type="text"
                    id="coupon"
                    name="coupon"
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="You have a voucher?"
                    className="bg-gray-200 appearance-none border-2 w-48 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-none active:border-none focus:border-red-700 rounded-br-none rounded-tr-none"
                  />
                  <button
                    onClick={() => handleDiscount(false)}
                    disabled={!coupon}
                    className="btn btn-red hover:shadow-lg disabled:bg-red-300 disabled:shadow-none active:bg-red-900 ease-linear transition-all duration-150 rounded-bl-none rounded-tl-none"
                  >
                    Apply
                  </button>
                </div>
                {discount ? (
                  <div className="flex flex-col w-full pt-2">
                    <div className="flex justify-between">
                      <span className="float-right p-1 font-bold tracking-wide text-sm">
                        Cart total
                      </span>
                      <span className="line-through font-bold tracking-wide text-md">
                        ${totalPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="float-right p-1 font-bold tracking-wide text-sm">
                        Coupon Discount
                      </span>
                      <span className="font-bold tracking-wide text-md">
                        ( -{discountData?.data.discountPercentage}%) - $
                        {totalPrice - discountData?.data.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="float-right p-1 font-bold tracking-wide text-sm">
                        Total amount
                      </span>
                      <span className="font-bold tracking-wide text-md">
                        ${discountData?.data.total}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="float-right p-2 font-bold tracking-wide text-md">
                    Cart total :
                    <span className="font-bold tracking-wide text-md">
                      ${totalPrice}
                    </span>
                  </span>
                )}
                <div className="flex flex-row">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-red hover:shadow-lg active:bg-red-900 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      handelCheckout(true);
                      setDiscount(false);
                      setShowModal(false);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="opacity-60 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
