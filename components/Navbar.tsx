import React, { useState } from "react";
import AuthForms from "./AuthForms";
import { useRouter } from 'next/router'
import Link from "next/link";

function Navbar(props: { isAuth: Boolean }) {
  const { isAuth } = props;
  const router = useRouter() 
  const [status, setStatus] = useState<Boolean>(false);
  const clickHandler = (e: any) => {
    if (e.target.id === "signin") {
      setStatus((status) => true);
    } else {
      setStatus((status) => false);
    }
  };

  const logoutHandler = () =>{
    localStorage.removeItem("token")
    router.reload()
  }
  return (
    <>
      <div className="bg-white drop-shadow flex place-items-center w-full px-8 text-red-700 h-12 flex-row justify-between">
        {isAuth ? (
          <>
            <div className="flex flex-row space-x-4 list-none">
              <Link href="/" className=" btn">Home</Link>
              <Link href="/movie" className="drawer-button btn">Movies</Link>
            </div>
            <div className="flex flex-row list-none">
              <li className="p-1 btn--link">Cart</li>
              <li className="p-1 btn--link">My Wishlist</li>
              <li className="p-1 btn--link">My profile</li>
              <li className="p-1 btn--link" onClick={logoutHandler}>Logout</li>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row space-x-4 list-none">
            <Link href="/" className=" btn">Home</Link>
            <Link href="/movie" className="drawer-button btn">Movies</Link>
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
          </>
        )}
      </div>
      <AuthForms status={status} />
    </>
  );
}

export default Navbar;
