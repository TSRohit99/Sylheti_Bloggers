import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import UserContext from "../context/UserContext";

function Navbar() {
  const { currentUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems =
    currentUser.userLoggedIn === false
      ? [
          { path: "/", link: "Home" },
          { path: "/blogs", link: "Blogs" },
          { path: "/about", link: "About" },
        ]
      : [
          { path: "/blogs", link: "Blogs" },
          { path: "/create", link: "Create" },
        ];

  if (currentUser.isAdmin) {
    navItems.push({ path: "/Admin", link: "Admin-Dash" });
  }

  return (
    <>
      <header className="bg-green-400 text-white fixed top-0 left-0 right-0 z-50 shadow-md">
        <nav className="py-2 px-2 max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-amber-800">
            Sylheti<span className="text-red-500"> Bloggers</span>
          </Link>

          {/* Nav Bar items */}
          <ul className="hidden md:flex gap-14 text-xl">
            {navItems.map(({ path, link }) => (
              <li className="text-black text-xl font-mono" key={path}>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                  to={path}
                >
                  {link}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Login Button */}
          {currentUser.userLoggedIn ? (
            <div>
              <Link to="/profile" className="block">
                <button className="bg-orange-500 rounded-lg px-5 py-2 text-black hover:bg-red-600 hover:text-orange-300 transition-all ease-out">
                  Profile
                </button>
              </Link>
            </div>
          ) : (
            <div>
              <Link to="/login" className="block">
                <button className="bg-orange-500 rounded-lg px-5 py-2 text-black text-sm md:text-lg hover:bg-red-600 hover:text-orange-300 transition-all ease-out">
                  Login/SignUp
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden mr-1 mt-1.5">
            <button onClick={toggleMenu} className="cursor-pointer">
              {isMenuOpen ? (
                <FaXmark className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden ">
            <ul className=" fixed top-14 right-0 z-40 bg-transparent p-4 list-none text-xl space-y-4">
              {navItems.map(({ path, link }) => (
                <li 
                  className="text-black bg-green-400 my-1 rounded-lg mb-2 text-xl p-1.5"
                  key={path}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active" : ""
                    }
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
