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
  // console.log(data);
  const {
    username,
    bid,
    headerPictureUrl,
    title,
    content,
    publishedAt,
    author,
    category,
    readingTime,
  } = data[0];
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
        alert("You already liked this post!");
      } else {
        const lData = {
          bid : bid,
          username : currentUser.username,
          x:"like" 
        }
        const responseLikeDislike = await axios.post(
          `http://localhost:8081/likedislike/`, lData);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const responseChecker = await fetch(
        `http://localhost:8081/checker/${bid}/${currentUser.username}`
      );
      const data = await responseChecker.json();
      // console.log(data);

      if (data.dislikedAlready) {
        alert("You already disliked this post!");
      } else {
        const lData = {
          bid : bid,
          username : currentUser.username,
          x:"dislike" 
        }
        const responseLikeDislike = await axios.post(
          `http://localhost:8081/likedislike/`, lData);
        // console.log(responseLikeDislike);
        setDisLikeCount(dislikeCount + 1);
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
      const response = await axios.post('http://localhost:8081/delete', null, {
        params: {
          bid: bid
        }
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
  return (
    <div className="blog-page py-14">
      <div className="header-section">
        <img
          src={`http://localhost:8081/images/${headerPictureUrl}`}
          alt="Blog Header"
          className="header-image"
          style={{ height: "200px" }}
        />
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
              <button
                onClick={handleDislike}
                style={{ backgroundColor: "orange" }}
              >
                <FontAwesomeIcon icon={faThumbsDown} /> Dislike {dislikeCount}
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
                <Link to={`/profile/${comment.author}`}>
                  <span className="comment-author">{comment.author}</span>{" "}
                </Link>{" "}
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
