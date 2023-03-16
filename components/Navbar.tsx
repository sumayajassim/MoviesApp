import React, { useContext, useState, useEffect, Fragment } from "react";
import AuthForms from "./AuthForms";
import { useRouter } from "next/router";
import Link from "next/link";
import useComponentVisible from "./helpers/useComponentVisible";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import { useAuth } from "@/context/auth";
import { Menu, Transition } from "@headlessui/react";

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

  // console.log({ isLoggedIn });

  return (
    <>
      <div className="bg-white drop-shadow flex fixed z-50 place-items-center w-full px-8 text-red-700 h-12 flex-row">
        <div
          className={` ${
            isLoggedIn ? "flex" : "hidden"
          } justify-between w-full`}
        >
          <div className={`flex-row space-x-4 list-none flex`}>
            <Link href="/" className=" btn">
              Home
            </Link>
            <Link href="/movie" className="drawer-button btn">
              Movies
            </Link>
          </div>
          <div className="flex flex-row list-none justify-end">
            <li className="btn btn--link">
              <button onClick={() => setShowModal(true)} type="button">
                Cart
              </button>
            </li>
            <li className="btn btn--link ">
              <button
                id="wishlist"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsComponentVisible(true);
                }}
                type="button"
              >
                <i className="fa-solid fa-heart"></i>
              </button>
              <div ref={ref}>{isComponentVisible && <Wishlist />}</div>
            </li>
            <li className="btn btn--link">
              <Menu>
                <Menu.Button>My profile</Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Duplicate
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Archive
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Move
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              {/* <a href="/profile">My profile</a> */}
            </li>
            <li className="btn btn--link" onClick={logout}>
              Logout
            </li>
          </div>
        </div>

        <div
          className={`${
            !isLoggedIn ? "flex" : "hidden"
          } justify-between w-full`}
        >
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
