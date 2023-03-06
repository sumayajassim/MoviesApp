import React, { useContext, useState, useEffect} from "react";
import AuthForms from "./AuthForms";
import { useRouter } from 'next/router'
import Link from "next/link";
import Context from "@/context/context";
import { toast } from "react-toastify";

function Navbar() {
  const router = useRouter() 
  const {isAuth, setIsAuth} = useContext(Context)
  const context = useContext(Context)
  const [status, setStatus] = useState<Boolean>(false);
  const clickHandler = (e: any) => {
    if (e.target.id === "signin") {
      setStatus((status) => true);
    } else {
      setStatus((status) => false);
    }
  };

  useEffect(()=> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if(token){
        setIsAuth(true)
      }else{
        setIsAuth(false)
    
      }
    }
  },[])


  const logoutHandler = () =>{
    localStorage.removeItem("token")
    setIsAuth(false)
    toast.success("You've been logged out successfully")
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
              <li className="btn btn--link">Cart</li>
              <li className="btn btn--link">
              
              <button
                id="dropdownDefaultButton"
                data-dropdown-toggle="dropdown"
                className="btn "
                type="button"
              >
                <span>Wishlist{" "}</span>
                {/* <svg
                  className="w-4 h-4 ml-2"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg> */}
              </button>
              <div
                id="dropdown"
                className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-52 dark:bg-gray-700"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Earnings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
              </li>
              <li className="btn btn--link">My profile</li>
              <li className="btn btn--link" onClick={logoutHandler}>Logout</li>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row space-x-4 list-none">
              <Link href="/" className="drawer-button btn">Home</Link>
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
