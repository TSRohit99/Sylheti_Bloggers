import React, { useState, useContext } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function CreateBlog({ value }) {
  const { currentUser } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [readingTime, setReadingTime] = useState("1");
  const [category, setCategory] = useState("");
  const [titleModified, setTitleModified] = useState(false);
  const [contentModified, setContentModified] = useState(false);
  const [readingTimeModified, setReadingTimeModified] = useState(false);
  const [categoryModified, setCategoryModified] = useState(false);
  const navigate = useNavigate();

  const data = value === "Update your Blog" ? useLoaderData() : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", titleModified ? title : data ? data[0].title : "");
    formData.append(
      "content",
      contentModified ? content : data ? data[0].content : ""
    );
    formData.append(
      "category",
      categoryModified ? category : data ? data[0].category : ""
    );
    formData.append(
      "readingTime",
      readingTimeModified ? readingTime : data ? data[0].readingTime : ""
    );

    if (value === "Update your Blog" && currentUser.username === data[0].username) {
      formData.append ("bid", data[0].bid);
      try {
        const response = await axios.post(
          `http://localhost:8081/update/`,
          formData
        );

        alert("You have successfully updated the blog!");
        navigate(`/blogs/${data[0].bid}`);
      } catch (error) {
        console.error("Error updating blog:", error);
      }
    } else if(value === "Create a new Blog" && currentUser.username!== "") {
      try {
        formData.append ("username", currentUser.username);
        const response = await axios.post(
          `http://localhost:8081/create`,
          formData
        );
        const bid = response.data.bid;
        console.log(bid);
        alert("You have successfully created the blog!");
        navigate(`/blogs/${bid}`);
      } catch (error) {
        console.error("Error creating blog:", error);
      }
    } else {
      alert("Error updating/creating the blog! Login first! ")
    }
  };

  return (
    <div className="parent-div">
      <div className="blog-form" style={{ paddingTop: "60px" }}>
        <h2 className="text-4xl text-center">{value}</h2> <br />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="header-picture">Header Picture:</label>

            {value === "Update your Blog" ? (
              <input
                type="file"
                accept="image/*"
                id="header-picture"
                onChange={(e) => setFile(e.target.files[0])}
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                id="header-picture"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              defaultValue={data ? data[0].title : ""}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleModified(true);
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              defaultValue={data ? data[0].content : ""}
              onChange={(e) => {
                setContent(e.target.value);
                setContentModified(true);
              }}
              required
              rows="9"
            />
          </div>
          <div className="form-group border-black">
            <label htmlFor="reading-time">Reading Time (minutes):</label>
            <input
              type="number"
              id="reading-time"
              defaultValue={data ? data[0].readingTime : ""}
              onChange={(e) => {
                setReadingTime(e.target.value);
                setReadingTimeModified(true);
              }}
              required
              min="1"
              step="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              defaultValue={data ? data[0].category : ""}
              onChange={(e) => {
                setCategory(e.target.value);
                setCategoryModified(true);
              }}
              required
            >
              <option value="">Select Category</option>
              <option value="GhuraGhuri">GhuraGhuri</option>
              <option value="Khani Review/Recipe">Khani Review/Recipe</option>
              <option value="Local News">Local News</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="cb ml-96">
            <button type="submit" className="bg-green-400">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
