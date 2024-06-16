import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Blogs from "./pages/Blogs.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import SingleBlog from "./components/SingleBlog.jsx";
import Profile from "./components/Profile.jsx";
import CreateBlog from "./components/CreateBlog.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ViewProfile from "./components/ViewProfile.jsx";

const Root = () => {
    const apiPrefix = 'https://sylheti-bloggers.onrender.com'
    // const apiPrefix = 'http://localhost:8081'
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/blogs",
          element: <Blogs />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/blogs/:bid",
          element: <SingleBlog />,
          loader: ({ params }) =>
            fetch(`${apiPrefix}/blogs/${params.bid}`),
        },
        {
          path: "/profile/:username",
          element: <ViewProfile />,
          loader: ({ params }) =>
            fetch(`${apiPrefix}/profile/${params.username}`),
        },
        {
          path: "/profile",
          element: <Profile />,
        },

        {
          path: "/create",
          element: <CreateBlog value="Create a new Blog" />,
        },
        {
          path: "/update/:bid",
          element: <CreateBlog value="Update your Blog" />,
          loader: ({ params }) =>
            fetch(`${apiPrefix}/blogs/${params.bid}`),
        },
        {
          path: "/admin",
          element: <AdminDashboard />,
          loader: async () =>
            await fetch(`${apiPrefix}/admin-dash`),
        },
      ],
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);