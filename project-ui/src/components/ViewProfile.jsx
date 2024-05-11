import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";

function ViewProfile() {
  const data = useLoaderData();
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <h1 className="mt-32 text-6xl text-center text-red-500">
          User not found! Maybe restrcited!
        </h1>
      </div>
    );
  }
  const { username, fname, joined, bio, area, pfpURL } = data[0];

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
      date:
        publishedAts[index] != null ? publishedAts[index].split("T")[0] : null,
    })),
  });

  const blogCount = data[0].bid !== null ? user.blogs.length : 0;

  return (
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
                {/* Render the anchor tag only if blog is not null */}
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
  );
}

export default ViewProfile;
