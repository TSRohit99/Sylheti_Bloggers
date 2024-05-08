import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";

async function fetchProfileData(username) {
  try {
    const response = await fetch(`http://localhost:8081/profile/${username}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null;
  }
}

function Profile() {
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
          profilePicture: "http://localhost:8081/images/" + pfpURL || "",
          bio: bio || "",
          joinDate: joinDate || "",
          from: area || "",
          bid: bid,
          blogs: (data.map((item) => ({
            id: item.bid || "",
            title: item.title || "",
            date: item.publishedAt ? item.publishedAt.split("T")[0] : null,
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
        `http://localhost:8081/update/profile`,
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

export default Profile;
