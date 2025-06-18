import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './store.js'
import { Provider } from 'react-redux'
import  { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <div className='min-h-screen w-screen overflow-hidden'>
    <App />
     <Toaster position='top-right' toastOptions={{
    style: {
      background: "#4CAF50", // it shows Green background
      color: "#fff",
    },
   
  }} />
      </div>
    </Provider>
  </StrictMode>,
)
