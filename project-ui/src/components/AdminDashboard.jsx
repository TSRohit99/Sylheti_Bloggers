import React, { useState, useContext, useEffect } from "react";
import {
  FaUsers,
  FaChartBar,
  FaClipboardCheck,
  FaBookOpen,
} from "react-icons/fa";
import { useLoaderData, Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";

const AdminDashboard = () => {
  const { currentUser } = useContext(UserContext);
   const apiPrefix = 'https://sylheti-bloggers.onrender.com'
  //  const apiPrefix = 'http://localhost:8081'
 
 
  if (!currentUser.isAdmin || currentUser.username === "") {
    return (
      <div className="flex justify-center items-center h-full">
        <h1 className="mt-32 text-6xl text-center text-red-500">
          You can't access this page!
        </h1>
      </div>
    );
  }

  const data = useLoaderData();

  if (data.state === "invalid") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="mb-4">(API failed to fetch)</p>
      </div>
    </div>
    );
  }

  const stats = {
    totalUser: data.users.length,
    adminCount: data.users[0].adminCount,
    verifiedUsers: data.totalUsers,
    unVerifiedUsersCount: data.users.length - data.totalUsers,
    totalLikes: data.totalLikes,
    totalComments: data.totalComments,
    restrictedUsers: data.restrictedUsers,
    totalBlogs: data.totalBlogs,
    restrictedBlogs: data.restrictedBlogs,
  };

  const [activeTab, setActiveTab] = useState("verification");

  useEffect(() => {
    // Get the active tab from local storage on component mount
    const storedActiveTab = localStorage.getItem("activeTab");
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
    }
  }, []);

  useEffect(() => {
    // Store the active tab in local storage whenever it changes
    localStorage.setItem("activeTab", activeTab);

    // Cleanup function to remove the stored value when the component unmounts
    return () => {
      localStorage.removeItem("activeTab");
    };
  }, [activeTab]);

  const apiResponseUsers = data.users;

  const users = apiResponseUsers.map((user) => ({
    id: user.id,
    role: user.role,
    username: user.username,
    email: user.email,
    area: user.area,
    userBlogs: user.totalBlogs || 0,
    isVerified: user.isVerified === 1,
    restricted: user.restricted === 1,
  }));
  const apiResponseBlogReports = data.reportedBlogs;

  const blogReports = apiResponseBlogReports.map((blog) => ({
    report_id: blog.report_id,
    blogId: blog.bid,
    reportedBy: blog.reportedBy,
    blogAuthor: blog.blogAuthor,
    reportText: blog.reportText,
    category: blog.category,
    solved: blog.solved,
    author_id: blog.author_id,
  }));

 
  const [reportText, setReportText] = useState("");
  // const apiKey = import.meta.env.VITE_API_KEY_SELF
  const VITE_API_KEY_SELF="IamYourFatherDamnNowGiveMeAccess";
  const header =  { 
    headers: {
      'x-api-key': apiKey 
    }
  }

  const handleVerifyUser = async (userId) => {
    try {
      const data = {
        id: userId,
        status: "verified",
      };
      const response = await axios.post(
        `${apiPrefix}/admin-action`,
        data,header
      );
      if (response.data.success) {
        alert(`${userId} user ID is now verified!`);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error while verifying : " + err);
    }
  };
  const handleDeleteUser = async (userId) => {
    // Implement logic to restrict the user with the given userId
    try {
      const data = {
        id: userId,
        status: "delete",
      };
      const confirmation = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (confirmation) {
        const response = await axios.post(
          `${apiPrefix}/admin-action`,
          data,header
        );
        if (response.data.success) {
          alert(`${userId} user ID is now deleted!`);
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error while deleting : " + err);
    }
  };

  const handleRestrictUser = async (userId) => {
    // Implement logic to restrict the user with the given userId
    try {
      const data = {
        id: userId,
        status: "restrict",
      };
      const confirmation = window.confirm(
        "Are you sure you want to restrict this user?"
      );
      if (confirmation) {
        const response = await axios.post(
          `${apiPrefix}/admin-action`,
          data,header
        );
        if (response.data.success) {
          alert(`${userId} user ID is now restricted!`);
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error while restricting : " + err);
    }
  };
  const handleUnRestrictUser = async (userId) => {
    try {
      const data = {
        id: userId,
        status: "unrestrict",
      };
      const confirmation = window.confirm(
        "Are you sure you want to unrestrict this user?"
      );
      if (confirmation) {
        const response = await axios.post(
          `${apiPrefix}/admin-action`,
          data,header
        );
        if (response.data.success) {
          alert(`${userId} user ID is now unrestricted!`);
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error while unrestricting : " + err);
    }
  };

  const handleSolved = async (report_id) => {
    // Implement logic to restrict the user with the given userId
    try {
      const data = {
        id: report_id,
        status: "solved",
        text: reportText,
      };
      const confirmation = true;
      // const confirmation = window.confirm(
      //   "Are you sure you want to solve this report?"
      // );
      if (confirmation) {
        const response = await axios.post(
          `${apiPrefix}/admin-action`,
          data, header
        );
        if (response.data.success) {
          alert(`${report_id} report_id is now solved!`);
          setReportText("");
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error while solving : " + err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 mt-10">
      <nav className="bg-indigo-600 text-white py-6 h-16 ">
        <h1 className="text-2xl font-bold text-center">Admin Dashboard</h1>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row">
        <div className="bg-indigo-700 text-white p-4 md:w-64">
          <h2 className="text-xl font-bold mb-4">Navigation</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className={`flex items-center text-white hover:bg-indigo-800 px-2 py-1 rounded ${
                  activeTab === "verification" ? "bg-indigo-800" : ""
                }`}
                onClick={() => setActiveTab("verification")}
              >
                <FaClipboardCheck className="mr-2" />
                Verification
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`flex items-center text-white hover:bg-indigo-800 px-2 py-1 rounded ${
                  activeTab === "users" ? "bg-indigo-800" : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                <FaUsers className="mr-2" />
                Users
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`flex items-center text-white hover:bg-indigo-800 px-2 py-1 rounded ${
                  activeTab === "blogReports" ? "bg-indigo-800" : ""
                }`}
                onClick={() => setActiveTab("blogReports")}
              >
                <FaBookOpen className="mr-2" />
                Blog Reports
              </a>
            </li>

            <li>
              <a
                href="#"
                className={`flex items-center text-white hover:bg-indigo-800 px-2 py-1 rounded ${
                  activeTab === "stats" ? "bg-indigo-800" : ""
                }`}
                onClick={() => setActiveTab("stats")}
              >
                <FaChartBar className="mr-2" />
                Stats
              </a>
            </li>
          </ul>
        </div>

        <div className="flex-1 p-4">
          {activeTab === "verification" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Verification</h2>
              <div className="bg-white shadow-md rounded p-4">
                <h3 className="text-xl font-bold mb-2">
                  Unverified Users ({stats.unVerifiedUsersCount})
                </h3>
                <ul>
                  {users
                    .filter((user) => !user.isVerified)
                    .map((user) => (
                      <li
                        key={user.id}
                        className="flex justify-between items-center mb-2"
                      >
                        <span className="w-1/4 truncate">{user.username}</span>
                        <span className="w-1/4 truncate">{user.email}</span>
                        <span className="w-1/4 truncate">{user.area}</span>
                        <span className="w-1/4"></span>
                        <div className="flex">
                          <button
                            onClick={() => handleVerifyUser(user.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Users & Admins ({stats.totalUser})</h2>
              <div className="bg-white shadow-md rounded p-4">
                <h3 className="text-xl font-bold mb-2">
                  All Admins ({stats.adminCount})
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="w-1/4 py-2 px-4 text-left">UserName</th>
                      <th className="w-1/4 py-2 px-4 text-left">Email</th>
                      <th className="w-1/4 py-2 px-4 text-left">Area</th>
                      <th className="w-1/4 py-2 px-4 text-left">Blog Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {users.filter((user) => user.isVerified).map((user) => ( */}
                    {users.filter((user)=> user.role=== "admin").map((user) => (
                      <tr key={user.id} className="border-b">
                        <td>
                          <Link to={`/profile/${user.username}`}>
                            {" "}
                            <span className="w-1/4 truncate text-lg">
                              {user.username}
                            </span>{" "}
                          </Link>{" "}
                        </td>
                        <td className="w-1/4 py-2 px-4 truncate">{user.email}</td>
                        <td className="w-1/4 py-2 px-4 truncate text-left">
                          {user.area}
                        </td>
                        <td className="w-1/4 py-2 px-4 truncate text-left">
                          {user.userBlogs}
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h3 className="mt-6 text-xl font-bold mb-2">
                  All Users ({stats.totalUser - stats.adminCount})
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="w-1/5 py-2 px-4 text-left">UserName</th>
                      <th className="w-1/3 py-2 px-4 text-left">Email</th>
                      <th className="w-1/5 py-2 px-4 text-left">Area</th>
                      <th className="w-1/5 py-2 px-4 text-left">Blog Count</th>
                      <th className="w-1/5 py-2 px-4 text-left">
                        Verification Status
                      </th>
                      <th className="w-1/5 py-2 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {users.filter((user) => user.isVerified).map((user) => ( */}
                    {users.filter((user)=> user.role!== "admin").map((user) => (
                      <tr key={user.id} className="border-b">
                        <td>
                          <Link to={`/profile/${user.username}`}>
                            {" "}
                            <span className="w-1/4 truncate text-lg">
                              {user.username}
                            </span>{" "}
                          </Link>{" "}
                        </td>
                        <td className="py-2 px-4 truncate">{user.email}</td>
                        <td className="py-2 px-4 truncate text-right">
                          {user.area}
                        </td>
                        <td className="py-2 px-4 truncate text-right">
                          {user.userBlogs}
                        </td>
                        <td className="py-2 px-4">
                          {!user.restricted ? (
                            <span
                              className={`px-2 py-1 rounded ${
                                user.isVerified
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {user.isVerified ? "Verified" : "Unverified"}
                            </span>
                          ) : (
                            <span
                              className={
                                "px-2 py-1 rounded  bg-red-500 text-white"
                              }
                            >
                              Restricted
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          {!user.restricted ? (
                            <button
                              onClick={() => handleRestrictUser(user.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Restrict
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnRestrictUser(user.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded"
                            >
                              UnRestrict
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Stats</h2>
              <div className="bg-white shadow-md rounded p-4">
                <div className="flex justify-between mb-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{stats.totalUser}</h3>
                    <p>Total Users</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-green-500">
                      {stats.totalBlogs}
                    </h3>
                    <p>Total Created Blogs</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-red-500">
                      {stats.restrictedBlogs}
                    </h3>
                    <p>Restricted/Deleted Blogs</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-red-500">
                      {stats.restrictedUsers}
                    </h3>
                    <p>Restricted Users</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-green-500">
                      {stats.totalLikes}
                    </h3>
                    <p>Total Cumulative Likes</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-green-500">
                      {stats.totalComments}
                    </h3>
                    <p>Total Comments</p>
                  </div>
                </div>
                {/* Add more stats or visualizations as needed */}
              </div>
            </div>
          )}

          {activeTab === "blogReports" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Blog Reports</h2>
              <div className="bg-white shadow-md rounded p-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="w-1/6 py-2 px-4 text-left text-indigo-600 font-semibold">
                        Reported By
                      </th>
                      <th className="w-1/6 py-2 px-4 text-left text-indigo-600 font-semibold">
                        Report Category
                      </th>
                      <th className="w-1/6 py-2 px-4 text-left text-indigo-600 font-semibold">
                        Blog Id
                      </th>
                      <th className="w-1/6 py-2 px-4 text-left text-indigo-600 font-semibold">
                        Blog Author
                      </th>
                      <th className="w-1/6 py-2 px-4 text-left text-indigo-600 font-semibold">
                        Action
                      </th>
                      <th className="w-1/6 py-2 px-4 text-left text-indigo-600 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogReports.map((report) => (
                      <React.Fragment key={report.report_id}>
                        <tr className="border-b">
                          <td className="py-2 px-4 truncate text-left">
                            {report.reportedBy}
                          </td>
                          <td className="py-2 px-4 truncate text-left">
                            {report.category}
                          </td>
                          <td className="py-2 px-4 truncate text-left text-lg font-semibold">
                          <Link to={`/blogs/${report.blogId}`}>
                            {report.blogId}
                            </Link>
                          </td>
                          <td className="py-2 px-4 truncate text-left text-lg font-semibold">
                          <Link to={`/profile/${report.blogAuthor}`}>
                            {report.blogAuthor}
                            </Link>
                          </td>
                          <td className="py-2 px-4">
                          <button 
                    className="bg-red-500 text-white px-2 py-1 rounded text-left"
                    onClick={() => {
                      handleRestrictUser(report.author_id);
                      handleSolved(report.report_id, report.adminFeedback);
                    }}>
                              Restrict
                            </button>
                          </td>
                          <td className="py-2 px-4">
                            <button 
                            className="bg-green-500 text-white px-2 py-1 rounded text-left"
                             onClick={() => handleSolved(report.report_id)}>
                              Solved
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="6"
                            className="py-2 px-4 text-left bg-gray-100"
                          >
                            <span className="text-red-500 text-md font-bold ">
                              {" "}
                              Report Text:{" "}
                            </span>{" "}
                            {report.reportText}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan="6"
                            className="py-2 px-4 text-left bg-gray-100"
                          >
                            <span className="text-gray-600 text-md font-bold">
                              Admin Feedback:
                            </span>
                            <form >
                            <textarea
                              className="mt-2 w-full p-2 border border-gray-300 rounded"
                              rows="2"
                              value={reportText}
                              onChange={(e) => setReportText(e.target.value)}
                              placeholder="Enter your feedback here"
                              required

                            ></textarea>
                          </form>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
