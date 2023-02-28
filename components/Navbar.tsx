import React, { useState } from "react";
import AuthForms from "./AuthForms";

function Navbar(props: { isAuth: Boolean }) {
  const { isAuth } = props;
  const [status, setStatus] = useState<Boolean>(false);
  console.log(isAuth);

  const clickHandler = (e: any) => {
    console.log(e.target.id);

    if (e.target.id === "signin") {
      setStatus((status) => true);
    } else {
      setStatus((status) => false);
    }
  };
  return (
    <>
      <div className="bg-white drop-shadow flex place-items-center w-full px-8 text-red-700 h-12 flex-row justify-between">
        {isAuth ? (
          <>
            <div className="flex flex-row space-x-4 list-none">
              <li className="drawer-button btn">Home</li>
              <li>Movies</li>
            </div>
            <div className="flex flex-row space-x-4 list-none">
              <li>Cart</li>
              <li>My Wishlist</li>
              <li>My profile</li>
              <li>Logout</li>
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
