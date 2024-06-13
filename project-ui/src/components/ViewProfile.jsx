import React, { useState, useEffect, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
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

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <h1 className="mt-32 text-6xl text-center text-red-500">
          User not found!
        </h1>
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

  const joinDate = joined.split("T")[0];

  const [user, setUser] = useState({
    fullName: fname || "", // Initialize with an empty string if fname is null or undefined
    profilePicture: "http://localhost:8081/images/" + pfpURL || "",
    bio: bio || "",
    joinDate: joinDate || "",
    from: area || "",
    blogs: titles.map((title, index) => ({
      id: bids[index] || "",
      title: title || "",
      date: publishedAts[index] != null ? publishedAts[index].split("T")[0] : null,
    })),
  });

  const blogCount = data[0].bid !== null ? user.blogs.length : 0;

  return (
    <>
      <div className="profile-page">
        <div className="user-info" style={{ paddingTop: "56px" }}>
          <div className="profile-picture">
            <img src={user.profilePicture} alt="Profile" />
          </div>
          <div className="user-details">
            <h1>
              {user.fullName} (@{username})
            </h1>
            <p>{user.bio}</p>
            <p>Joined: {user.joinDate}</p>
            <p>From: {user.from}</p>
          </div>
        </div>

        <div className="blog-post-history">
          <h2>Blog Post History ({blogCount})</h2>
          {blogCount > 0 && (
            <ul>
              {user.blogs.map((blog) => (
                <li key={blog.id}>
                  <a href={`/blogs/${blog.id}`}>
                    {blog.title.substring(0, 50) + "......"}
                  </a>
                  <span>{blog.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-red-700">This user has been restricted due to violating rules, admins are checking his blogs/comments!</h2>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewProfile;
