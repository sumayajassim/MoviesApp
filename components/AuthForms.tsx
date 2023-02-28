import React from "react";

function AuthForms(props: { status: Boolean }) {
  console.log("status", props.status);
  const {status}  = props
  const handleClick = () => {
    if(status){
      console.log('Sign in ');
      
    }else{
      console.log('Sign up');
      
    }
  }
  return (
    <div
      id="drawer-right-example"
      className="fixed top-14 right-2 z-40 min-h-fit p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800 rounded-2xl"
      // tabIndex="-1"
      aria-labelledby="drawer-right-label"
    >
      <ul className="p-5 text-base-content">
        <div className="card glass ">
          <div className="card-body flex flex-col space-y-3">
            <h2 className="card-title text-red-700">
              {status ? "Sign In" : "Register"}{" "}
            </h2>
            {!status && (
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
            />
            <input
              type="password"
              placeholder="********"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
            />
            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-red w-full" onClick={handleClick}>
                {status ? "Sign In" : "Register"}
              </button>
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
}

export default AuthForms;
