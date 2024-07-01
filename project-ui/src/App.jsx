import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserContextProvider from "./context/UserContextProvider";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <UserContextProvider>
        
      <Navbar />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000
         }
         } />
      <Outlet />
     
    </UserContextProvider>
  );
}

export default App;
