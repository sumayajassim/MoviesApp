import React, {useState, useEffect} from "react";
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { toast } from "react-toastify";
import { Drawer } from "flowbite";
import type { DrawerOptions, DrawerInterface } from "flowbite";

import axios from 'axios'
function AuthForms(props: { status: Boolean }) {
  const router = useRouter()
  const {status}  = props
  const [emailAddress, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	// const [drawer, setDrawer] = useState(true)
  // let drawer:DrawerInterface ;

  // useEffect(() => {
  //   if(document){
  //     const targetEl: HTMLElement = document.getElementById('drawer-right-example')
  //     drawer = new Drawer(targetEl);
  //   }
  // },[])
 
  const handleClick = () => {
    if(status){
      handleLogin()
      
    }else{
      console.log('Sign up');
      
    }
  }
  // const onClick = () => toast('Toast is good', { hideProgressBar: true, autoClose: 2000, type: 'success' })

 
  const { mutate: handleLogin, isLoading: handleLoginLoading } = useMutation({
		mutationFn: () => axios.post('/api/signin', { emailAddress, password }),
		onSuccess: (res) => {
      localStorage.setItem('token', res.data.token)
      router.reload(); console.log('Logged in ')},
		onError: () => toast('Invalid credentials')
	})
  return (
    <div
      id="drawer-right-example"
      className="fixed top-14 right-2 z-40 min-h-fit p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800 rounded-2xl"
      tabIndex={"-1"}
      aria-labelledby="drawer-right-label"
    >
      <ul className="p-5 text-base-content">
        <div className="card glass ">
          <div className="card-body flex flex-col space-y-3">
            <h2 className="card-title text-red-700">
              {status ? "Sign In" : "Register"}{" "}
            </h2>
            {!status && (
              <>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
              />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              name="emailAddress"
              value={emailAddress}
              onChange={e => setEmail(e.target.value)}
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-700"
            />
            <input
              type="password"
              placeholder="********"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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