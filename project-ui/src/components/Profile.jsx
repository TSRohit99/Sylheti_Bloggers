import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";

async function fetchProfileData(username) {
  const apiPrefix = "https://sylheti-bloggers.onrender.com";
  //  const apiPrefix = 'http://localhost:8081'

  // const apiKey = import.meta.env.VITE_API_KEY_SELF
  const apiKey=IamYourFatherDamnNowGiveMeAccess

  const header =  { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey 
      }
    }

  try {
    const response = await fetch(`${apiPrefix}/profile/${username}`,header);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

function Profile() {
  
  // const apiKey = import.meta.env.VITE_API_KEY_SELF
  const apiKey="IamYourFatherDamnNowGiveMeAccess";
   const apiPrefix = "https://sylheti-bloggers.onrender.com";
  //  const apiPrefix = 'http://localhost:8081'
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    profilePicture: "",
    bio: "",
    joinDate: "",
    from: "",
    bid: null,
    blogs: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProfileData(currentUser.username);
      if (data && data.length > 0) {
        const { fname, joined, bio, area, pfpURL, bid } = data[0];
        const joinDate = joined.split("T")[0];
        setUser({
          fullName: fname || "",
          profilePicture: pfpURL,
          bio: bio || "",
          joinDate: joinDate || "",
          from: area || "",
          bid: bid,
          blogs: data.map((item) => ({
            bid: item.bid || "",
            title: item.title || "",
            publishedAt: item.publishedAt
              ? item.publishedAt.split("T")[0]
              : null,
            published: item.published,
            deleted: item.deleted,
          })),
        });
      }
    };

    fetchData();
  }, [currentUser]);

  const blogCount = user.bid !== null ? user.blogs.length : 0;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    const formData = new FormData();
    const { fullName, bio, from } = user;
    formData.append("file", file);
    formData.append("fullName", fullName);
    formData.append("bio", bio);
    formData.append("from", from);
    formData.append("username", currentUser.username);

    axios
      .post(`${apiPrefix}/update/profile`, formData,  { 
        headers: {
          'x-api-key': apiKey 
        }
      })
      .then((req) => console.log(req))
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prevUser) => ({
        ...prevUser,
        profilePicture: reader.result,
      }));
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleBlog = async (bid, order) => {
    try {
      const method = order ? "publish" : "unpublish";
      const data = {
        bid: bid,
        method: method,
      };

      const confirmation = window.confirm(
        `Are you sure you want to ${method} this blog ?`
      );
      if (confirmation) {
        const response = await axios.post(
          `${apiPrefix}/profile/blog-action`,
          data,  { 
            headers: {
              'x-api-key': apiKey 
            }
          }
        );
        if (response.data.success) {
          toast.success(`Blog index ${bid} is now ${method}ed!`);
          setTimeout(() => window.location.reload(), 2000);
        } else {
          toast.error(`Error while performing this task!`);
          setTimeout(() => window.location.reload(), 2000);
        }
      }
    } catch (err) {
      console.error("Error while solving : " + err);
    }
  };

  const handleDelete = async (bid) => {
    const confirmation = window.confirm("Are you sure you want to delete?");

    if (confirmation) {
      const response = await axios.post(
        `${apiPrefix}/delete`, 
        null, 
        {
          params: {
            bid: bid,
          },
          headers: {
            'x-api-key': apiKey,
          },
        }
      );
      const data = response.data;
      if (data.success) {
        toast.success("This blog has been deleted successfully!");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error("Failed to delete the blog. Please try again later.");
      }
    }
  };
  const handleLogout = () => {
    setCurrentUser({
      userLoggedIn: false,
      username: "",
    });
    toast.success("You have successfully logged Out!");
    navigate(`/`);
  };

  return (
    <div className="profile-page">
      <div
        className="user-info flex flex-col items-center md:flex-row md:items-start"
        style={{ paddingTop: "56px" }}
      >
        <div className="profile-picture mb-4 md:mb-0 md:mr-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="rounded-full w-24 h-24 object-cover"
          />
          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="upload-input"
              />
              <label
                htmlFor="upload-input"
                className="edit-button block text-center mt-2 text-blue-600"
              >
                Upload Picture
              </label>
            </>
          )}
        </div>
        <div className="user-details text-center md:text-left">
          <h1 className="text-xl font-bold mb-2">
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                className="block w-full px-2 py-1 text-center md:text-left"
              />
            ) : (
              user.fullName
            )}{" "}
            (@{currentUser.username})
          </h1>
          <p className="mb-2 md:text-left">
            {isEditing ? (
              <textarea
                name="bio"
                value={user.bio}
                onChange={handleChange}
                className="block w-full px-2 py-1"
              />
            ) : (
              user.bio
            )}
          </p>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <p className="mb-2 md:mb-0">Joined: {user.joinDate}</p>
            <p className="mb-2 md:mb-0">
              From:{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="from"
                  value={user.from}
                  onChange={handleChange}
                  className="block w-full px-2 py-1"
                />
              ) : (
                user.from
              )}
            </p>
          </div>
        </div>
      </div>

      {currentUser.userLoggedIn === true ? (
        isEditing ? (
          <div className="" onClick={handleSave}>
            <FontAwesomeIcon icon={faSave} />
            <span> Save</span>
          </div>
        ) : (
          <div className="" onClick={handleEdit}>
            <FontAwesomeIcon icon={faUserEdit} /> Edit
          </div>
        )
      ) : null}

      {/* Logout button */}
      {currentUser.userLoggedIn === true ? (
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-3"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : null}

      <div className="blog-post-history mt-6">
        <h2 className="text-xl font-bold mb-4">
          Blog Post History ({blogCount})
        </h2>
        {blogCount > 0 && (
  <div className="overflow-x-auto">
    <table className="w-full whitespace-nowrap">
      <thead className="bg-gray-200">
        <tr>
          <th className="py-2 px-4 md:px-6 text-left">Blog Index</th>
          <th className="py-2 px-4 md:px-6 text-left">Blog Title</th>
          <th className="py-2 px-4 md:px-6 text-left">Created At</th>
          <th className="py-2 px-4 md:px-6 text-left">Action</th>
          <th className="py-2 px-4 md:px-6 text-left">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {user.blogs.map((blog) => (
          <tr key={blog.bid} className="border-b">
            <td className="py-2 px-4 md:px-6">
              <Link
                to={`/blogs/${blog.bid}`}
                className="text-blue-600 hover:underline block w-full"
              >
                {blog.bid}
              </Link>
            </td>
            <td className="py-2 px-4 md:px-6">
              <Link
                to={`/blogs/${blog.bid}`}
                className="text-blue-600 hover:underline block w-full"
              >
                {blog.title}
              </Link>
            </td>
            <td className="py-2 px-4 md:px-6">{blog.publishedAt}</td>
            <td className="py-2 px-4 md:px-6">
              {blog.published ? (
                <button
                  onClick={() => handleBlog(blog.bid, 0)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  UnPublish
                </button>
              ) : (
                <button
                  onClick={() => handleBlog(blog.bid, 1)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Publish
                </button>
              )}
            </td>
            <td className="py-2 px-4 md:px-6">
              <button
                onClick={() => handleDelete(blog.bid)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      </div>
    </div>
  );
}

export default Profile;
