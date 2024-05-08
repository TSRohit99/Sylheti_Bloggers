import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import UserContext from "../context/UserContext";

function Navbar() {
  const { currentUser } = useContext(UserContext);
  const [isMenuOpen, set] = useState(false);
  const toggleMenu = () => {
    set(!isMenuOpen);
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
  return (
    <>
      <header className="bg-green-400 text-white fixed top-0 left-0 right-0">
        <nav className="py-2 px-2 max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-amber-800 text">
            Sylheti<span className="text-red-500"> Bloggers</span>
          </a>

          {/* Nav Bar items*/}

          <ul className="md:flex gap-14 text-xl hidden">
            {navItems.map(({ path, link }) => (
              <li className="text-black text-xl font-mono" key={path}>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "active" : isPending ? "pending" : ""
                  }
                  to={path}
                >
                  {link}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Login Button */}
          {currentUser.userLoggedIn === true ? (
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
                <button className="bg-orange-500 rounded-lg px-5 py-2 text-black hover:bg-red-600 hover:text-orange-300 transition-all ease-out">
                  Login/SignUp
                </button>
              </Link>
            </div>
          )}

          {/* for mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="cursor-pointer">
              {isMenuOpen ? (
                <FaXmark className=" w-5 h-5" />
              ) : (
                <FaBars className=" w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Menu Item for mobile */}

        <div>
          <ul
            className={`md:hidden my-15 list-none text-right text-xl block space-y-4 bg-transparent ${
              isMenuOpen ? "fixed transition-all ease-out" : "hidden"
            }`}
          >
            {navItems.map(({ path, link }) => (
              <li
                className="text-black bg-green-400 my-1 rounded-sm mb-2"
                key={path}
              >
                <NavLink to={path}>{link}</NavLink>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  );
}

export default Navbar;
