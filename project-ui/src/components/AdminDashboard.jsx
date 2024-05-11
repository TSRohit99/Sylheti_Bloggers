import { useState, useContext, useEffect } from "react";
import { FaUsers, FaChartBar, FaClipboardCheck } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";

const AdminDashboard = () => {
  const { currentUser } = useContext(UserContext);
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

  const stats = {
    totalUser: data.users.length,
    verifiedUsers: data.totalUsers,
    unVerifiedUsersCount: data.users.length - data.totalUsers,
    totalLikes: data.totalLikes,
    totalComments: data.totalComments,
    restrictedUsers: data.restrictedUsers,
    totalBlogs: data.totalBlogs,
    restrictedBlogs: data.restrictedBlogs,
  };

  console.log(stats);

  const [activeTab, setActiveTab] = useState('verification');

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
    name: user.fname,
    email: user.email,
    area: user.area,
    userBlogs: user.totalBlogs || 0,
    isVerified: user.isVerified === 1,
    restricted: user.restricted === 1,
  }));

  const handleVerifyUser = async (userId) => {
    try {
      const data = {
        id: userId,
        status: "verified",
      };
      const response = await axios.post(
        `http://localhost:8081/admin-action`,
        data
      );
      if (response.data.success) {
        alert(`${userId} user ID is now verified!`);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error while verifying : " + err);
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
          `http://localhost:8081/admin-action`,
          data
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
          `http://localhost:8081/admin-action`,
          data
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
                        <span className="w-1/4 truncate">{user.name}</span>
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
                            onClick={() => handleRestrictUser(user.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Restrict
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
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              <div className="bg-white shadow-md rounded p-4">
                <h3 className="text-xl font-bold mb-2">
                  All Users ({stats.totalUser})
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="w-1/5 py-2 px-4">Name</th>
                      <th className="w-1/3 py-2 px-4">Email</th>
                      <th className="w-1/5 py-2 px-4">Area</th>
                      <th className="w-1/5 py-2 px-4">Blog Count</th>
                      <th className="w-1/5 py-2 px-4">Verification Status</th>
                      <th className="w-1/5 py-2 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {users.filter((user) => user.isVerified).map((user) => ( */}
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-2 px-4 truncate">{user.name}</td>
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
                              className="bg-red-500 text-white px-2 py-1 rounded"
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
                    <h3 className="text-xl font-bold text-green-500">{stats.totalBlogs}</h3>
                    <p>Total Blogs</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-red-500">{stats.restrictedBlogs}</h3>
                    <p>Restricted Blogs</p>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
