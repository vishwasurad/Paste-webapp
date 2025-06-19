import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchAllPastes,
  createPaste,
  deletePaste,
  setLoading,
  setError,
  clearError 
} from '../redux/pasteSlice'; // Adjust path as needed
import toast from 'react-hot-toast';

const Paste1 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get state from Redux store
  const { pastes, isLoading, error } = useSelector((state) => state.paste);
  
  // Local state for creating new paste
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  // Fetch all pastes when component mounts
  useEffect(() => {
    const loadPastes = async () => {
      try {
        await dispatch(fetchAllPastes()).unwrap();
      } catch (error) {
        console.error('Error loading pastes:', error);
        toast.error('Failed to load pastes');
      }
    };
    
    loadPastes();
  }, [dispatch]);
  
  // Handle create new paste
  const handleCreatePaste = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    
    try {
      const pasteData = {
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString()
      };
      
      await dispatch(createPaste(pasteData)).unwrap();
      setTitle('');
      setContent('');
      setIsCreating(false);
      toast.success('Paste created successfully!');
    } catch (error) {
      toast.error('Failed to create paste');
      console.error('Create error:', error);
    }
  };
  
  // Handle delete paste
  const handleDeletePaste = async (pasteId) => {
    if (!pasteId) {
      toast.error('No paste ID found');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this paste?')) {
      try {
        await dispatch(deletePaste(pasteId)).unwrap();
        toast.success('Paste deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete paste');
        console.error('Delete error:', error);
      }
    }
  };
  
  // Handle copy to clipboard
  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };
  
  // Handle view paste (you can navigate to a detailed view if needed)
  const handleViewPaste = (pasteId) => {
    // You can navigate to a detailed view page if you have one
    // navigate(`/paste/${pasteId}`);
    console.log('View paste:', pasteId);
  };
  
  // Filter pastes based on search term
  const filteredPastes = pastes.filter(paste => 
    paste.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paste.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Loading state
  if (isLoading && pastes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <div className="ml-4 text-lg text-gray-600">Loading pastes...</div>
      </div>
    );
  }
  
  // Error state
  if (error && pastes.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              dispatch(clearError());
              dispatch(fetchAllPastes());
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    // outer covering of allpastes and it is used to give some space in left and right equally
    <div id='paste1-id' className='w-full h-full max-w-[1200px] mx-auto py-14 px-5 lg:px-0 '>
      {/* it is second outer covering and it is used to set everyone in column */}
      <div className='flex flex-col items-start gap-y-5'>   
        {/* search section */}
        <div className='w-full flex flex-row justify-center items-center '>
          <input 
            className='dark-change w-full p-2 rounded-md pl-4 border-2 border-[rgba(128,121,121,0.5)] dark:bg-[#1a1a1a]' 
            type="search" 
            placeholder='Search paste here...' 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        {/* Create New Paste Button */}
        <div className='w-full flex justify-end'>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {isCreating ? 'Cancel' : 'Create New Paste'}
          </button>
        </div>
        
        {/* Create New Paste Form */}
        {isCreating && (
          <div className="w-full dark-change border-2 border-[rgba(128,121,121,0.5)] rounded-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Paste</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="dark-change w-full p-2 rounded-md pl-4 border-2 border-[rgba(128,121,121,0.5)] dark:bg-[#1a1a1a]"
                placeholder="Enter paste title..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="dark-change w-full p-2 rounded-md pl-4 border-2 border-[rgba(128,121,121,0.5)] dark:bg-[#1a1a1a] font-mono"
                placeholder="Enter your content here..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  setIsCreating(false);
                  setTitle('');
                  setContent('');
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreatePaste}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                disabled={!title.trim() || !content.trim()}
              >
                Create Paste
              </button>
            </div>
          </div>
        )}
        
        {/* all paste section */}
        <div className='w-full flex flex-col rounded-md border-2 border-[rgba(128,121,121,0.5)]'>
          <h2 className='text-4xl font-bold py-6 px-7 border-b-2 border-[rgba(128,121,121,0.5)] flex flex-row justify-start items-center'>All Notes</h2> 
          
          {/* pastes-slab-box */}
          {/* section that contain paste list */}
          <div className='flex flex-col gap-y-5 my-5 mx-5 border-[rgba(128,121,121,0.5)]'>
            {
              filteredPastes.length > 0 ? ( 
                filteredPastes.map((paste) => {
                  return (
                    // whole-single-paste-slab
                    <div className='dark-change transition-colors duration-300 dark:hover:bg-[#1a1a1a] border-2 border-[rgba(128,121,121,0.5)] rounded flex gap-y-5 justify-between items-center p-3 max-sm:flex-col max-sm:items-start' key={paste?._id}>
                      {/* left part */}
                      <div className='flex flex-col gap-y-2 w-[50%] max-sm:w-[100%]'>
                        {/* Title section  */}
                        <div className='text-3xl font-semibold'>
                          {paste.title || 'Untitled'}
                        </div>
                        {/* content section  */}
                        <div className='text-sm font-normal line-clamp-3 max-w-[80%]'>
                          {paste.content || 'No content available'}
                        </div>
                      </div>
                      
                      {/* right-part */}
                      <div className='flex flex-col items-end gap-y-2 max-sm:items-start max-sm:gap-y-3'>
                        {/* button-group or icons */}
                        <div className='flex flex-row gap-x-3 justify-evenly items-center'>
                          {/* Edit-btn  */}
                          <button 
                            onClick={() => handleViewPaste(paste._id)}
                            className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-blue-500 transition-colors`}
                            title="Edit"
                          >
                            <svg className='dark:text-white text-black group-hover:text-blue-500 transition-colors' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"/>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                            </svg>
                          </button>
                          
                          {/* view-btn  */}
                          <button 
                            onClick={() => handleViewPaste(paste._id)}
                            className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-purple-500 transition-colors`}
                            title="View"
                          >
                            <svg className='dark:text-white text-black group-hover:text-purple-500 transition-colors' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          
                          {/* Deletepaste-btn  */}
                          <button 
                            onClick={() => handleDeletePaste(paste?._id)} 
                            className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-red-500 transition-colors`}
                            title="Delete"
                          >
                            <svg className='dark:text-white text-black group-hover:text-red-500 transition-colors' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                              <line x1="10" y1="11" x2="10" y2="17"/>
                              <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                          </button>
                          
                          {/* copy-btn  */}
                          <button 
                            onClick={() => handleCopy(paste?.content)} 
                            className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-green-500 transition-colors`}
                            title="Copy"
                          >
                            <svg className="dark:text-white text-black group-hover:text-green-500 transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                          </button>
                          
                          {/* share-btn  */}
                          <button 
                            onClick={() => {
                              const shareUrl = `${window.location.origin}/paste/${paste._id}`;
                              navigator.clipboard.writeText(shareUrl);
                              toast.success('Share link copied to clipboard!');
                            }} 
                            className={`border-2 rounded-[0.2rem] border-[#c7c7c7] p-2 group hover:border-orange-500 transition-colors`}
                            title="Share"
                          >
                            <svg className='dark:text-white text-black group-hover:text-orange-500 transition-colors' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="18" cy="5" r="3"/>
                              <circle cx="6" cy="12" r="3"/>
                              <circle cx="18" cy="19" r="3"/>
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                            </svg>
                          </button>
                        </div>
                        
                        {/* date-div */}
                        <div className='flex gap-x-2 items-center'>
                          <svg className='dark:text-white text-black' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {paste?.createdAt ? new Date(paste.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }) : 'Unknown date'}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                // if nothing is there in paste then this will show that is not found
                <div className="text-2xl text-center w-full text-red-500">
                  {searchTerm ? 'No pastes found matching your search.' : 'No Data Found'}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paste1;