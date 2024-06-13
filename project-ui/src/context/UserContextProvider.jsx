import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({ children }) => {
  // Check if user data exists in localStorage, otherwise use default state
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser
      ? JSON.parse(storedUser)
      : { userLoggedIn: false, username: "", isAdmin: false, restricted: false };
  });

  // Update localStorage whenever user state changes
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  // Synchronize authentication state across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "currentUser") {
        const storedUser = localStorage.getItem("currentUser");
        setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;