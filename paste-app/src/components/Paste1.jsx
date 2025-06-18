import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { removeFromPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Calendar, Copy, Eye, PencilLine, Share, Trash2 } from "lucide-react";
const Paste1 = () => {
    // allpastes which are availaible at store
    const pastes = useSelector(
        (state) => state.paste.pastes
    );
   
    const [searchTerm, setSearchTerm] = useState("");
    // dispatch is a instance of useDispatch() that is now it can use all the methods and properties of useDispatch()
    const dispatch = useDispatch();
    // console.log(pastes);
    // it is a data which is filtered based on the title written on the search section
    const filteredData = pastes.filter(
        (paste) => paste.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // console.log(filteredData);
    const [screenshotUrl, setScreenshotUrl] = useState(null);



    function handleDelete(pasteId) {
        dispatch(removeFromPastes(pasteId));
    }
    
    
    // it is function used to share link of the view page of paste to others 
    function handleShare(paste) {
        const shareUrl = `${window.location.origin}/pastes/${paste._id}`;
      
        if (navigator.share) {
          // Web Share API for mobile & modern browsers
          navigator
            .share({
              title: paste.title,
              text: `Check out this paste: ${shareUrl}`, // Ensures link is clickable
              url: shareUrl, // Ensures it is treated as a link
            })
            .then(() => toast.success("Sharing file... 🚀"))
            .catch((error) => console.log("Sharing failed:", error));
        } else {
          // Fallback for unsupported browsers (copy link)
          navigator.clipboard.writeText(shareUrl);
          toast.success("Link copied to clipboard!");
        }
      }
 
      
    

    return (
        // outer covering of allpastes and it is used to give some space in left and right equally
        <div id='paste1-id' className='w-full h-full max-w-[1200px] mx-auto py-14 px-5 lg:px-0 '>
             {/* it is second outer covering and it is used to set everyone in column */}
            <div className='flex flex-col  items-start gap-y-5  '>   
                {/* search section */}
            <div className='w-full flex flex-row justify-center items-center '>
            <input className='dark-change w-full p-2 rounded-md pl-4   border-2 border-[rgba(128,121,121,0.5)] dark:bg-[#1a1a1a]' type="search" placeholder='Search paste here...' value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} />
            </div>
                {/* all paste section */}
            <div className=' w-full flex flex-col  rounded-md border-2  border-[rgba(128,121,121,0.5)]  '>
               <h2 className='text-4xl font-bold bg-red- py-6 px-7 border-b-2  border-[rgba(128,121,121,0.5)] flex flex-row justify-start items-center'>All Notes</h2> 
                           {/* pastes-slab-box */}
                {/* section that contain paste list */}
            <div className='flex flex-col gap-y-5  my-5 mx-5  border-[rgba(128,121,121,0.5)]'>
                {
                    filteredData.length > 0 ? ( filteredData.map(
                        (paste) => {
                            return (
                                // whole-single-paste-slab
                                <div className='dark-change transition-colors duration-300 dark:hover:bg-[#1a1a1a] border-2 border-[rgba(128,121,121,0.5)] rounded flex  gap-y-5 justify-between items-center p-3 max-sm:flex-col max-sm:items-start' key={paste?._id}>
                                    {/* left part */}
                                    <div className='flex flex-col gap-y-2 w-[50%] max-sm:w-[100%]'>
                                        {/* Title section  */}
                                    <div className='text-3xl font-semibold' >
                                        {paste.title}
                                    </div>
                                    {/* content section  */}
                                    <div className='text-sm font-normal line-clamp-3 max-w-[80%]  '>
                                        {paste.content}
                                    </div>
                                    </div>
                                    {/* right-part */}
                            <div className='flex flex-col items-end gap-y-2 max-sm:items-start max-sm:gap-y-3'>
                                 {/* button-group or icons */}
                                    <div className='flex flex-row gap-x-3 justify-evenly items-center '>
                                        {/* Edit-btn  */}
                                        <NavLink to={`/?pasteId=${paste?._id}`} className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-blue-500`}><PencilLine className='dark:text-white text-black group-hover:text-blue-500'size={20}/>     </NavLink>
                                        {/* <button>
                                            View
                                        </button> */}
                                        {/* view-btn  */}
                                        <NavLink to={`/pastes/${paste?._id}`}className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-purple-500`}><Eye className='dark:text-white text-black group-hover:text-purple-500'size={20}/> </NavLink>
                                        <button onClick={() => handleDelete(paste?._id)} className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-red-500`}>
                                         {/* Deletepaste-btn  */}
                                        <Trash2 className='dark:text-white text-black group-hover:text-red-500' size={20}/>
                                        </button>
                                        {/* copy-btn  */}
                                        <button onClick={() => { navigator.clipboard.writeText(paste?.content); toast.success("Copied to clipboard"); }} className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-green-500`} >

                                        <Copy className="dark:text-white text-black group-hover:text-green-500" size={20} />
                                        </button>
                                          
                                          {/* share-btn  */}
                                        <button onClick={() => handleShare(paste)} className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-orange-500`}> <Share className='dark:text-white text-black group-hover:text-orange-500'size={20}/> </button>
                                       
                                    </div>
                                    {/* date-div */}
                                    <div className='flex gap-x-2 items-center'>
                                        <Calendar className='dark:text-white text-black' size={20}/>
                            {new Date(paste?.createdAt).toLocaleDateString("en-US", {  weekday: "short",month: "long", day: "numeric", year: "numeric" })}
                                      </div>
                                       </div>
                                </div>
                            )
                        }
                    ) ):(
                        // if nothing is their in paste then this will show that is not found
                    <div className="text-2xl text-center w-full text-chileanFire-500">
                        No Data Found
                      </div>)  }
            </div>
                </div>
            </div>
        </div>
    )
}

export default Paste1
