import React from 'react'
import { NavLink } from 'react-router-dom'
import {NavbarData} from "../data/Navbar"
import  { useEffect, useState } from "react";
import { Sun,Moon } from 'lucide-react';
const Navbar = () => {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);


  return (
    <div className='w-full  flex flex-row gap-x-6 justify-center items-center p-2 bg-gray-800 text-white font-medium '>
       {/* the map method access the array from navbar.js and render each nav item  */}
       {/* always remember never use the {} inside the map,filter,reduce after a arrow function like this (link,idx)=>{} if you want o use it then use like this (link,idx)=>{ return (code)}  */}
       {/* idx-index and link-path */}

     {
      NavbarData.map(
        (link,idx)=>
          
          <NavLink key={idx} to={link.path} className={({isActive})=> isActive? "text-blue-400 font-semibold text-xl" :"text-white font-medium text-xl"}>
             {link.title}
          </NavLink>
      )
     }
     {/* Dark Mode Toggle Button */}
     <button
        className="btn px-4 py-1.5 rounded-md border-transparent dark:border-2 text-white font-medium   bg-blue-600 hover:bg-blue-700 outline-none "
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <Sun fill='white' size={20}/> : <Moon fill='white' size={20}/> }
      </button>


       {/* <NavLink to="/" className={"p-2  hover:bg-gray-700 text"}>
         Home
       </NavLink>

       <NavLink to="/pastes" className={"p-2  hover:bg-gray-700"} >
         Pastes
       </NavLink> */}
    </div>
  )
}

export default Navbar
