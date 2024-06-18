import React, { useState, useEffect, useContext } from "react";
import { useLoaderData, useNavigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import Profile from "./Profile";

function ViewProfile() {
  const data = useLoaderData();
  const { currentUser } = useContext(UserContext);

  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (data && data[0]?.restricted === 1) {
      setShowReportModal(true);
    }
  }, [data]);

  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  

  if (!data || data.length === 0) {

    useEffect(() => {
      const timer = setTimeout(() => {
        if (countdown === 0) {
          navigate('/');
        } else {
          setCountdown(countdown - 1);
        }
      }, 1000);
  
      return () => clearTimeout(timer);
    }, [countdown, navigate]);
    
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="mb-4">This profile doesn't exits!</p>
        <p className="text-lg font-bold text-red-500 mb-6">
          Redirecting to the homepage in {countdown} seconds...
        </p>
      </div>
    </div>
    );
  }

  const { username, fname, joined, bio, area, pfpURL, restricted } = data[0];

  if (currentUser.username === username) {
    return <Profile />;
  }

  // Create an array to store the unique values for title, publishedAt, and bid
  const titles = [];
  const publishedAts = [];
  const bids = [];

  for (let i = 0; i < data.length; i++) {
    // Destructure the title, publishedAt, and bid from each row
    const { title, publishedAt, bid } = data[i];
    titles.push(title);
    publishedAts.push(publishedAt);
    bids.push(bid);
  }

  const joinDate = joined?.split("T")[0];

  const [user, setUser] = useState({
    fullName: fname || "", // Initialize with an empty string if fname is null or undefined
    profilePicture: pfpURL,
    bio: bio || "",
    joinDate: joinDate || "",
    from: area || "",
    blogs: titles.map((title, index) => ({
      bid: bids[index] || "",
      title: title || "",
      publishedAt:
        publishedAts[index] != null ? publishedAts[index].split("T")[0] : null,
    })),
  });

  const blogCount = data[0].bid !== null ? user.blogs.length : 0;

  return (
    <>
      <div className="profile-page">
        <div
          className="user-info flex flex-col md:flex-row items-center md:items-start"
          style={{ paddingTop: "56px" }}
        >
          <div className="profile-picture mb-4 md:mb-0 md:mr-4">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="rounded-full w-24 h-24 object-cover"
            />
          </div>
          <div className="user-details text-center md:text-left">
            <h1 className="text-xl font-bold mb-2">
              {user.fullName} (@{username})
            </h1>
            <p className="mb-2 md:text-left">{user.bio}</p>
            <div className="flex flex-col md:flex-row md:justify-between">
              <p className="mb-2 md:mb-0">Joined: {user.joinDate}</p>
              <p className="mb-2 md:mb-0">From: {user.from}</p>
            </div>
          </div>
        </div>

        <div className="blog-post-history">
          <h2 className="text-xl font-bold mb-4">
            Blog Post History ({blogCount})
          </h2>
          {blogCount > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-6 text-left w-1/4 md:w-auto">
                      Blog Index
                    </th>
                    <th className="py-3 px-6 text-left w-1/2 md:w-auto">
                      Blog Title
                    </th>
                    <th className="py-3 px-6 text-left w-1/4 md:w-auto">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.blogs.map((blog) => (
                    <tr key={blog.bid}>
                      <td className="py-3 px-6 whitespace-nowrap">
                        <Link
                          to={`/blogs/${blog.bid}`}
                          className="text-blue-600 hover:underline"
                        >
                          {blog.bid}
                        </Link>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap">
                        <Link
                          to={`/blogs/${blog.bid}`}
                          className="text-blue-600 hover:underline"
                        >
                          {blog.title}
                        </Link>
                      </td>
                      <td className="py-3 px-6 whitespace-nowrap">
                        {blog.publishedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-red-700">
              This user has been restricted due to violating rules, admins are
              checking his blogs/comments!
            </h2>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewProfile;
