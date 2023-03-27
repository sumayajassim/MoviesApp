import React, { useState, useEffect, useContext, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Formik } from "formik";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/context/auth";
import { MutationResponse } from "@/types";

function SignUp() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: handleAuth, isLoading: handleLoginLoading } = useMutation({
    mutationFn: (values: { emailAddress: String; password: String }) =>
      axios.post("/api/auth/signup", values),
    onSuccess: (res) => {
      if (!res.data.token) return;
      login(res.data.token);
      document
        .getElementById("sign-up-drawer")
        ?.classList.add(
          "transition-transform",
          "right-0",
          "top-14",
          "translate-x-full"
        );
      document.querySelector("div[drawer-backdrop]")?.removeAttribute("class");
      queryClient.invalidateQueries(["userDetails"]);
    },
    onError: (err: MutationResponse) => {
      console.log(err);
      toast.error(`${err?.response?.data?.message}`);
    },
  });
  return (
    <div
      id="sign-up-drawer"
      className="fixed top-16 right-[-20px] z-40 min-h-fit p-4 pr-8 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800 rounded-2xl"
      tabIndex={-1}
      aria-labelledby="sign-up-drawer"
    >
      <ul className="p-5 text-base-content">
        <div className="flex flex-col space-y-3">
          <h2 className="text-red-700">Sign Up</h2>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              emailAddress: "",
              password: "",
            }}
            validate={(values) => {
              const errors = { emailAddress: "" };
              if (!values.emailAddress) {
                errors.emailAddress = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                  values.emailAddress
                )
              ) {
                errors.emailAddress = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                // alert(JSON.stringify(values, null, 2));
                handleAuth(values);

                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="firstName"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                />
                {errors.firstName && touched.firstName && errors.firstName}
                <input
                  type="text"
                  name="lastName"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                />
                {errors.lastName && touched.lastName && errors.lastName}
                <input
                  type="email"
                  name="emailAddress"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.emailAddress}
                />
                {errors.emailAddress &&
                  touched.emailAddress &&
                  errors.emailAddress}
                <input
                  type="password"
                  name="password"
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && touched.password && errors.password}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-red w-full"
                    disabled={isSubmitting}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </ul>
    </div>
  );
}

export default SignUp;
