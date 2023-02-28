import React, { useState } from "react";
import AuthForms from "./AuthForms";
import { useRouter } from 'next/router'

function Navbar(props: { isAuth: Boolean }) {
  const { isAuth } = props;
  const [status, setStatus] = useState<Boolean>(false);
  console.log(isAuth);
  const router = useRouter() 
  const clickHandler = (e: any) => {
    console.log(e.target.id);

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
              <li className=" btn">Home</li>
              <li className="drawer-button btn">Movies</li>
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
              <li className="drawer-button btn">Home</li>
              <li className="drawer-button btn">Movies</li>
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
