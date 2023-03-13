import React, { useContext, useState, useEffect } from "react";
import AuthForms from "./AuthForms";
import { useRouter } from "next/router";
import Link from "next/link";
import Context from "@/context/context";
import { toast } from "react-toastify";
import useComponentVisible from "./helpers/useComponentVisible";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import { type } from "os";
import { useAuth } from "@/context/auth";

function Navbar() {
  const router = useRouter();
  const [status, setStatus] = useState<Boolean>(false);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  // const { userRef, isDropdownVisible, setIsDropDownVisible } = useComponentVisible(false);
  const [showModal, setShowModal] = useState(false);

  const { isLoggedIn, logout } = useAuth();

  const clickHandler = (e: any) => {
    if (e.target.id === "signin") {
      setStatus((status) => true);
    } else {
      setStatus((status) => false);
    }
  };

  console.log({ isLoggedIn });

  return (
    <>
      <div className="bg-white drop-shadow flex fixed z-50 place-items-center w-full px-8 text-red-700 h-12 flex-row justify-between">
        <div className={` ${isLoggedIn ? "flex" : "hidden"}`}>
          <div className={`flex-row space-x-4 list-none flex`}>
            <Link href="/" className=" btn">
              Home
            </Link>
            <Link href="/movie" className="drawer-button btn">
              Movies
            </Link>
          </div>
          <div className="flex flex-row list-none">
            <li className="btn btn--link">
              <button onClick={() => setShowModal(true)} type="button">
                Cart
              </button>
            </li>
            <li className="btn btn--link ">
              <button
                id="wishlist"
                onClick={() => setIsComponentVisible(true)}
                type="button"
              >
                <i className="fa-solid fa-heart"></i>
              </button>
              <div ref={ref}>{isComponentVisible && <Wishlist />}</div>
            </li>
            <li className="btn btn--link">My profile</li>
            <li className="btn btn--link" onClick={logout}>
              Logout
            </li>
          </div>
        </div>

        <div className={`${!isLoggedIn ? "flex" : "hidden"}`}>
          <div className={`flex flex-row space-x-4 list-none`}>
            <Link href="/" className="drawer-button btn">
              Home
            </Link>
            <Link href="/movie" className="drawer-button btn">
              Movies
            </Link>
          </div>
          <div className="flex flex-row space-x-4 list-none">
            <button
              type="button"
              id="signin"
              onClick={clickHandler}
              data-drawer-target="drawer-right-example"
              data-drawer-show="drawer-right-example"
              data-drawer-placement="right"
              aria-controls="drawer-right-example"
            >
              Signin
            </button>
            <button
              type="button"
              id="register"
              onClick={clickHandler}
              data-drawer-target="drawer-right-example"
              data-drawer-show="drawer-right-example"
              data-drawer-placement="right"
              aria-controls="drawer-right-example"
            >
              Signup
            </button>
          </div>
        </div>
      </div>

      <AuthForms status={status} />
      <Cart showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

export default Navbar;
