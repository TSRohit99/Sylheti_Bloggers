import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";

async function fetchProfileData(username) {
  const apiPrefix = 'https://sylheti-bloggers.onrender.com'
  //  const apiPrefix = 'http://localhost:8081'
  try {
    const response = await fetch(`${apiPrefix}/profile/${username}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

function Profile() {
   const apiPrefix = 'https://sylheti-bloggers.onrender.com'
  //  const apiPrefix = 'http://localhost:8081'
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    profilePicture: "",
    bio: "",
    joinDate: "",
    from: "",
    bid:null,
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
          blogs: (data.map((item) => ({
            bid: item.bid || "",
            title: item.title || "",
            publishedAt: item.publishedAt ? item.publishedAt.split("T")[0] : null,
            published: item.published,
            deleted: item.deleted,
          }))),
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
      .post(
        `${apiPrefix}/update/profile`,
        formData
      )
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
        `Are you sure you want to ${method} this blog ?`)
      if (confirmation) {
        const response = await axios.post(
          `${apiPrefix}/profile/blog-action`,
          data
        );
        if (response.data.success) {
          alert(`Blog index ${bid} is now ${method}ed!`);
          window.location.reload();
        }
        else {
          alert(`Error while performing this task!`);
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error while solving : " + err);
    }
  }

  const handleDelete = async (bid) => {
    const confirmation = window.confirm("Are you sure you want to delete?");

    if (confirmation) {
      const response = await axios.post(`${apiPrefix}/delete`, null, {
        params: {
          bid: bid,
        },
      });
      const data = response.data;
      if (data.success) {
        alert("This blog has been deleted successfully!");
        window.location.reload();
      } else {
        alert("Failed to delete the blog. Please try again later.");
      }
    }
  };
  const handleLogout = () => {
    setCurrentUser({
      userLoggedIn: false,
      username: "",
    });
    alert("You have successfully logged Out!");
    navigate(`/`);
  };

  return (
    <div className="profile-page">
      <div className="user-info" style={{ paddingTop: "56px" }}>
        <div className="profile-picture">
          <img src={user.profilePicture} alt="Profile" />
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
                className="edit-button"
                style={{ textAlign: "left" }}
              >
                Upload Picture
              </label>
            </>
          )}
        </div>
        <div className="user-details">
          <h1>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
              />
            ) : (
              user.fullName
            )}{" "}
            (@{currentUser.username})
          </h1>
          <p>
            {isEditing ? (
              <textarea name="bio" value={user.bio} onChange={handleChange} />
            ) : (
              user.bio
            )}
          </p>
          <p>Joined: {user.joinDate}</p>
          <p>
            From:{" "}
            {isEditing ? (
              <input
                type="text"
                name="from"
                value={user.from}
                onChange={handleChange}
              />
            ) : (
              user.from
            )}
          </p>
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
      <div className="blog-post-history">
        <h2>Blog Post History ({blogCount})</h2>
        
        {blogCount > 0 && (  
        <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="w-1/4 py-2 px-4 text-left">Blog Index</th>
                      <th className="w-1/3 py-2 px-4 text-left">Blog Title</th>
                      <th className="w-1/4 py-2 px-4 text-left">Created At</th>
                      <th className="w-1/4 py-2 px-4 text-left">Action</th>
                      <th className="w-1/5 py-2 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.blogs.filter((item)=> item.deleted == 0 ).map((blog) => (
                      <tr key={blog.bid} className="border-b">
                        <td>
                          <Link to={`/blogs/${blog.bid}`}>
                            {" "}
                            <span className="w-1/4 truncate text-lg">
                              {blog.bid}
                            </span>{" "}
                          </Link>{" "}
                        </td>
                        <td className="py-2 px-4 truncate">
                        <Link to={`/blogs/${blog.bid}`}> {blog.title} </Link></td>

                        <td className="py-2 px-4 truncate text-right">
                          {blog.publishedAt}
                        </td>
                        <td className="py-2 px-4">
                          {blog.published ? (
                            <button
                              onClick={() => handleBlog(blog.bid , 0 )}
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
                        <td className="py-2 px-4">
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
                </table>)
        
        }
         





      </div>
    </div>
  );
}

export default Profile;
