import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchPasteById, 
  deletePaste,
  setLoading,
  setError 
} from '../redux/pasteSlice'; // Adjust path as needed
import toast from 'react-hot-toast';

const ViewPaste = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Get state from Redux store
  const { currentPaste, isLoading, error } = useSelector((state) => state.paste);
  
  // Fetch paste data when component mounts or id changes
  useEffect(() => {
    if (id) {
      dispatch(fetchPasteById(id));
    }
  }, [dispatch, id]);
  
  // Handle copy to clipboard
  const handleCopy = async () => {
    if (currentPaste?.content) {
      try {
        await navigator.clipboard.writeText(currentPaste.content);
        toast.success('Content copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy content');
      }
    }
  };
  
  // Handle delete paste
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this paste?')) {
      try {
        await dispatch(deletePaste(id)).unwrap();
        toast.success('Paste deleted successfully!');
        navigate('/'); // Navigate to home page
      } catch (error) {
        toast.error('Failed to delete paste');
        console.error('Delete error:', error);
      }
    }
  };
  
  // Handle edit navigation
  const handleEdit = () => {
    navigate(`/paste/${id}`); // Navigate to edit page (assuming this is your edit route)
  };
  
  // Handle share functionality
  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy share link');
    }
  };
  
  // Loading state - keep your original loading design
  if (isLoading) {
    return (
      <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
        <div className="flex flex-col gap-y-5 items-start justify-start">
          <div className="w-full flex flex-row gap-x-4 justify-between items-center">
            <div className="w-[80%] flex flex-row gap-x-4 justify-start items-center">
              <div className="w-[20%] h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-[25%] h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-[25%] h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-[25%] h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-y-4 justify-start items-start">
            <div className="w-full h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-full h-96 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state - keep your original error design
  if (error) {
    return (
      <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
        <div className="flex flex-col gap-y-5 items-center justify-center min-h-[400px]">
          <div className="text-red-500 text-xl font-semibold">Error loading paste</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  // If no paste found - keep your original not found design
  if (!currentPaste) {
    return (
      <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
        <div className="flex flex-col gap-y-5 items-center justify-center min-h-[400px]">
          <div className="text-gray-500 text-xl font-semibold">Paste not found</div>
          <div className="text-gray-600">The paste you're looking for doesn't exist or has been deleted.</div>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-5 items-start justify-start">
        
        {/* Action buttons row - keeping original design */}
        <div className="w-full flex flex-row gap-x-4 justify-between items-center">
          <div className="w-[80%] flex flex-row gap-x-4 justify-start items-center">
            <button 
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={handleEdit}
            >
              Edit
            </button>
            
            <button 
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={handleCopy}
            >
              Copy
            </button>
            
            <button 
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              onClick={handleShare}
            >
              Share
            </button>
            
            <button 
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
          
          <div className="w-[20%] flex justify-end">
            <div className="text-sm text-gray-500">
              {new Date(currentPaste.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Title section - keeping original design */}
        <div className="w-full flex flex-col gap-y-4 justify-start items-start">
          <input
            type="text"
            placeholder="Title"
            value={currentPaste.title || 'Untitled'}
            disabled
            className="w-full text-black border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-semibold"
          />
          
          {/* Content section - keeping original design */}
          <textarea
            value={currentPaste.content || ''}
            disabled
            placeholder="Write your content here...."
            rows={20}
            className="w-full text-black border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-mono"
          />
        </div>
        
        {/* Metadata section - keeping original design if you had one */}
        {currentPaste && (
          <div className="w-full flex flex-row justify-between items-center text-sm text-gray-500 border-t pt-4">
            <div className="flex gap-4">
              <span>
                <strong>Created:</strong> {new Date(currentPaste.createdAt).toLocaleString()}
              </span>
              {currentPaste.updatedAt && currentPaste.updatedAt !== currentPaste.createdAt && (
                <span>
                  <strong>Updated:</strong> {new Date(currentPaste.updatedAt).toLocaleString()}
                </span>
              )}
            </div>
            <div>
              <strong>ID:</strong> {currentPaste._id}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ViewPaste;