import React, { useContext, useState, useEffect } from "react";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon  } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faClock,
  faStopwatch,
  faCalendarAlt,
  faThumbsUp,
  faThumbsDown,
  faEdit,
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

function SingleBlog() {
 const apiPrefix = 'https://sylheti-bloggers.onrender.com'
//  const apiPrefix = 'http://localhost:8081'
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const data = useLoaderData();
  const [countdown, setCountdown] = useState(5);

  

  if (data.state === "invalid") {
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
        <p className="mb-4">This blog doesn't exits! (API failed to fetch)</p>
        <p className="text-lg font-bold text-red-500 mb-6">
          Redirecting to the homepage in {countdown} seconds...
        </p>
      </div>
    </div>
    );
  }

  const {
    published,
    username,
    id,
    bid,
    title,
    content,
    publishedAt,
    author,
    category,
    readingTime,
  } = data.data[0];

  if (published == 0) {
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
        <p className="mb-4">This blog has been deleted or unpublished!</p>
        <p className="text-lg font-bold text-red-500 mb-6">
          Redirecting to the homepage in {countdown} seconds...
        </p>
      </div>
    </div>
    );
  }
  const date = publishedAt.split("T")[0];
  const [likeCount, setLikeCount] = useState(null);
  const [dislikeCount, setDisLikeCount] = useState(null);
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState(null);
  const [totalComment, setTotalComment] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [repCategory, setRepCategory] = useState("");
  const [alreadyReported, setAlreadyReported] = useState(false);
  // const apiKey = import.meta.env.VITE_API_KEY_SELF
  const VITE_API_KEY_SELF="IamYourFatherDamnNowGiveMeAccess";
  const header =  { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey 
      }
    }
 

  useEffect(() => {
    // Fetch like and dislike counts

    const fetchLikeDislikeCounts = async () => {
      try {
        const response = await fetch(`${apiPrefix}/info/${bid}`,header);
        const data = await response.json();
        setLikeCount(data.likeCount);
        // setDisLikeCount(data.dislikeCount);
        const formData = new FormData();
        formData.append("reportedBy", currentUser.username);
        formData.append("bid", bid);
        const check = await axios.post(`${apiPrefix}/blogs/reportcheck`, formData, {
          headers: {
            'x-api-key': apiKey
          }
        }); 
        if(check.data.success)
          setAlreadyReported(true);

      } catch (error) {
        console.error("Error fetching like/dislike counts:", error);
      }
    };

    // Fetch comments
    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiPrefix}/comments/${bid}`,header);
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
        `${apiPrefix}/checker/${bid}/${currentUser.username}`, header
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
            `${apiPrefix}/likedislike/`,
            lData,  {
              headers: {
                'x-api-key': apiKey
              }
            }
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
          `${apiPrefix}/likedislike/`,
          lData, {
            headers: {
              'x-api-key': apiKey
            }
          }
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
      const response = await axios.post(`${apiPrefix}/delete`, null, {
        params: {
          bid: bid,
        },
        headers: {
          'x-api-key': apiKey
        }
      });
      const data = response.data;

      if (data.success) {
        toast.success("This blog has been deleted successfully!");
        setTimeout(() => navigate(`/blogs`), 2000);
      } else {
        toast.error("Failed to delete the blog. Please try again later.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("comment_text", userComment);
    formData.append("author", currentUser.username);
    formData.append("bid", bid);


    if (!userComment) {
      toast('Please enter a comment before submitting.!', {
        icon: '⚠️',
      });
      return;
    }
    try {
      const response = await axios.post(
        `${apiPrefix}/addcomment`,
        formData, {
          headers: {
            'x-api-key': apiKey
          }
        }
      );
      if (response.data.success) {
        toast.success("You have successfully commented on the blog!");
        setUserComment("");
        setTimeout(() => window.location.reload(), 2000);
        
      } else {
        toast.error("Failed to add comment. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again later.");
    }
  };

  const backgroundImages = data.images;

  const imgPrefix = `${apiPrefix}/images/`;
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


  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("reportedBy", currentUser.username);
    formData.append("reportText", reportText);
    formData.append("repCategory", repCategory);
    formData.append("bid", bid);
    formData.append("blogAuthor", username);
    formData.append("author_id", id);
    try{
    const response = await axios.post(`${apiPrefix}/report/blogs`,
    formData,  {
      headers: {
        'x-api-key': apiKey
      }
    });
  
    if( response.data.success){
      toast.success("You have succesfully reported, admins will check this report ASAP!")
      setTimeout(() => window.location.reload(), 2000);
      
    }

  }catch(err){
    console.error("got an error : ", err);
    toast.error("Error when reporting : status -> failed")
  }

    setShowReportModal(false);
    setReportText("");
    setRepCategory("");
  };

  const handleReportCancel = () => {
    setShowReportModal(false);
    setReportText("");
  };
  return (
    <div className="blog-page py-14">
      <div className="header-section ">
        <img
          src={backgroundImages[activeImageIndex].image}
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
          <FontAwesomeIcon icon={faStopwatch} /> {readingTime} min
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

              {currentUser.username !== username ? (
                !alreadyReported ? (
                  <button
                    onClick={handleReport}
                    style={{ backgroundColor: "red" }}
                  >
                    <FontAwesomeIcon icon={faTriangleExclamation} /> Report
                  </button>
                ) : (
                  <button style={{ backgroundColor: "red" }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} /> Reported
                  </button>
                )
              ) : null}
            </div>
          ) : null}
          {currentUser.isAdmin || currentUser.username === username ? (
            <div>
              {currentUser.username === username || !currentUser.isAdmin ? (
                <button
                  onClick={handleEdit}
                  style={{ backgroundColor: "gray" }}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              ) : null}

              <button onClick={handleDelete} style={{ backgroundColor: "red" }}>
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </div>
          ) : null}
        </div>

        {showReportModal && (
         <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
         <div className="bg-white rounded-lg p-6 w-96">
           <h2 className="text-lg font-bold mb-4">Report Content</h2>
           <form onSubmit={handleReportSubmit}>
             <div className="form-group mb-4">
               <label htmlFor="repCategory">Category:</label>
               <select
                 id="repCategory"
                 className="w-full p-2 border border-gray-300 rounded-md mt-1"
                 onChange={(e) => setRepCategory(e.target.value)}
                 required
               >
                 <option value="">Select Category</option> {/* Default option should have an empty value */}
                 <option value="Fraud">Fraud</option>
                 <option value="FakeNews">FakeNews</option>
                 <option value="Sensitive">Sensitive</option>
               </select>
             </div>
             <textarea
               className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4"
               value={reportText}
               onChange={(e) => setReportText(e.target.value)}
               placeholder="Kulia koin kitar lagi report marra..."
               required
             />
             <div className="flex justify-end">
               <button
                 type="button"
                 className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                 onClick={handleReportCancel}
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 className="px-4 py-2 bg-green-500 text-white rounded-md"
               >
                 Submit
               </button>
             </div>
           </form>
         </div>
       </div>
       
        )}

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
