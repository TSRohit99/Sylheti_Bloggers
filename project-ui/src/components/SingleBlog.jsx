import React, { useContext, useState, useEffect } from "react";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClock,
  faCalendarAlt,
  faThumbsUp,
  faThumbsDown,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "../context/UserContext";
import axios from "axios";

function SingleBlog() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const data = useLoaderData();
  if (!data.data[0] || data.data[0].length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <h1 className="mt-32 text-6xl text-center text-red-500">
          Blog not found!
        </h1>
      </div>
    );
  }

  const {
    username,
    bid,
    title,
    content,
    publishedAt,
    author,
    category,
    readingTime,
  } = data.data[0];
  const date = publishedAt.split("T")[0];
  const [likeCount, setLikeCount] = useState(null);
  const [dislikeCount, setDisLikeCount] = useState(null);
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState(null);
  const [totalComment, setTotalComment] = useState(0);

  useEffect(() => {
    // Fetch like and dislike counts
    const fetchLikeDislikeCounts = async () => {
      try {
        const response = await fetch(`http://localhost:8081/info/${bid}`);
        const data = await response.json();
        setLikeCount(data.likeCount);
        setDisLikeCount(data.dislikeCount);
      } catch (error) {
        console.error("Error fetching like/dislike counts:", error);
      }
    };

    // Fetch comments
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8081/comments/${bid}`);
        const data = await response.json();
        setTotalComment(data.length);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchLikeDislikeCounts();
    fetchComments();
  }, [bid]);

  const handleLike = async () => {
    try {
      const responseChecker = await fetch(
        `http://localhost:8081/checker/${bid}/${currentUser.username}`
      );
      const data = await responseChecker.json();
      if (data.likedAlready) {
        const lData = {
          bid: bid,
          username: currentUser.username,
          x: "dislike",
        };
        const confirmation = window.confirm(
          "Are you sure you want to remove the like?"
        );
        if (confirmation) {
          const responseLikeDislike = await axios.post(
            `http://localhost:8081/likedislike/`,
            lData
          );

          setLikeCount(likeCount - 1);
        } else return;
      } else {
        const lData = {
          bid: bid,
          username: currentUser.username,
          x: "like",
        };
        const responseLikeDislike = await axios.post(
          `http://localhost:8081/likedislike/`,
          lData
        );
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/update/${bid}`);
  };

  const handleDelete = async () => {
    const confirmation = window.confirm("Are you sure you want to delete?");

    if (confirmation) {
      const response = await axios.post("http://localhost:8081/delete", null, {
        params: {
          bid: bid,
        },
      });
      const data = response.data;
      if (data.success) {
        alert("This blog has been deleted successfully!");
        navigate("/blogs");
      } else {
        alert("Failed to delete the blog. Please try again later.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment_text", userComment);
    formData.append("author", currentUser.username);
    formData.append("bid", bid);

    console.log("User Comment:", userComment);
    console.log("Current User:", currentUser.username);
    console.log("FormData:", formData);

    if (!userComment) {
      alert("Please enter a comment before submitting.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8081/addcomment`,
        formData
      );
      if (response.data.success) {
        alert("You have successfully commented on the blog!");
        setUserComment("");
        window.location.reload();
      } else {
        alert("Failed to add comment. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again later.");
    }
  };

  const backgroundImages = data.images;

  const imgPrefix = "http://localhost:8081/images/";
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);
  const handlePreviousImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="blog-page py-14">
      <div className="header-section">
        <img
          src={imgPrefix + backgroundImages[activeImageIndex].image}
          alt="Blog Header"
          className="header-image"
          style={{ height: "200px" }}
        />
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded"
          onClick={handlePreviousImage}
        >
          &larr;
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded"
          onClick={handleNextImage}
        >
          &rarr;
        </button>
        <div className="author-details">
          <Link
            to={
              currentUser.username !== username
                ? `/profile/${username}`
                : "/profile"
            }
          >
            {" "}
            <span>
              <FontAwesomeIcon icon={faUser} /> {author}
            </span>{" "}
          </Link>
          <span>
            <FontAwesomeIcon icon={faClock} /> {readingTime} min
          </span>
          <span>
            <FontAwesomeIcon icon={faCalendarAlt} /> {date}
          </span>
        </div>
      </div>

      <div className="category-section">
        <span>
          {" "}
          <b> Category :</b> {category}
        </span>
      </div>
      <div className="blog-details">
        <h1>{title}</h1>
        <p>{content}</p>
        <div className="reaction-buttons ">
          {currentUser.username !== "" ? (
            <div>
              <button onClick={handleLike}>
                <FontAwesomeIcon icon={faThumbsUp} /> Like {likeCount}
              </button>
            </div>
          ) : null}
          {currentUser.isAdmin || currentUser.username === username ? (
            <div>
              {currentUser.username === username || !currentUser.isAdmin ? (
                <button
                  onClick={handleEdit}
                  style={{ backgroundColor: "gray" }}
                >
                  <FontAwesomeIcon icon={faEdit} /> EDIT
                </button>
              ) : null}

              <button onClick={handleDelete} style={{ backgroundColor: "red" }}>
                <FontAwesomeIcon icon={faTrash} /> DELETE
              </button>
            </div>
          ) : null}
        </div>

        {/* comment section */}

        <div className="comment-section">
          <h2>Comments ({totalComment})</h2>
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.comment_id} className="comment-item">
                {currentUser.username === comment.author ? (
                  <Link to={`/profile`}>
                    <span className="comment-author">{comment.author}</span>{" "}
                  </Link>
                ) : (
                  <Link to={`/profile/${comment.author}`}>
                    <span className="comment-author">{comment.author}</span>{" "}
                  </Link>
                )}
                : <span className="comment-text">{comment.comment_text}</span>
              </li>
            ))}
          </ul>
          {/* Input for new comment */}
          {currentUser.username !== "" ? (
            <div className="new-comment">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="comment"
                  placeholder="Write a comment..."
                  onChange={(e) => setUserComment(e.target.value)}
                />
                <button type="submit">Submit</button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SingleBlog;
