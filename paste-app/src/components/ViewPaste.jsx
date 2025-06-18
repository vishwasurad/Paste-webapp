import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Copy, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
const ViewPaste = () => {
   
  // id parameter which is fetched by useParams hook
  const {id}=useParams();
  // allpaste which is stored in store
  const allPastes=useSelector((state)=>state.paste.pastes );
  // the specific paste is diplayedd based on the id of that paste i tis that paste
  const paste=allPastes.find((item)=>item._id===id);
   

  return (
    <div className='w-full h-full max-w-[1200px] mx-auto  py-8 px-5 lg:px-0'>
    <div className='flex flex-col gap-y-6 items-start'>
      <div className='w-full flex flex-row justify-between items-center gap-x-4 '>
       <input disabled className={`w-[100%] dark-change dark:focus:border-[#646cff] outline-none focus:border-black p-2 rounded-md   border-2 border-[rgba(128,121,121,0.5)] dark:bg-[#1a1a1a]`} placeholder="Title" type="text"  value={paste.title} onChange={(e)=>{setTitle(e.target.value)}} />
     </div>
     <div className='group  textbox-content w-full flex flex-col rounded items-start border-[0px]  bg-opacity-10  backdrop-blur-2xl'>
       <div className="  header-box w-full rounded-t-md flex flex-row justify-between items-center gap-x-4 px-4 py-2 border-x-2 border-t-2 border-[rgba(128,121,121,0.5)]">
         <div className="circle-container flex flex-row justify-evenly items-center gap-x-3  ">
 
         <div className="circle   bg-[rgb(255,95,87)]"></div>
         <div className="circle  bg-[rgb(254,188,46)]"></div>
         <div className="circle  bg-[rgb(45,200,66)]"></div>
         </div>
         <div className="copy-btn">
           <button className=' rounded-lg font-medium flex justify-center items-center pr-4 transition-all duration-300 ease-in-out group' onClick={() => { navigator.clipboard.writeText(paste.content); toast.success("Copied to clipboard"),{position:"top-right",} }}> <Copy className='group-hover:text-sucess-500' size={20}/>   </button>
         </div>
       </div>
       <textarea disabled className='w-full p-3   group-hover:dark-change dark:focus:border-[#646cff] outline-none focus:border-black border-2 border-[rgba(128,121,121,0.5)] rounded-b-md rounded-t-none dark:bg-[#1a1a1a]' style={{ caretColor: "#000",}} name="" id="" placeholder='Write Your Content Here....' value={paste.content} rows={20} onChange={(e)=>{setValue(e.target.value)}}></textarea>
     </div>
      </div>
    
     </div>
  )
}

export default ViewPaste
