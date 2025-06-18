import { useState } from 'react'

import './App.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home';
import ViewPaste from './components/ViewPaste';
import Paste1 from './components/Paste1';



const router=createBrowserRouter(
  [
    {
       path:"/",
       element:
       <div>
        <Navbar/>
         <Home/>
       </div>
    },
    {
       path:"/pastes",
       element:
       <div>
        <Navbar/>
       <Paste1/>
       </div>
    },
    {
       path:"/pastes/:id",
       element:
       <div>
        <Navbar/>
        <ViewPaste/>
       </div>
    },
  ]
);


function App() {
 
  return (
    <div>

    <RouterProvider router={router}>
        Note-Saver
    </RouterProvider>
    </div>
  )
}

export default App
