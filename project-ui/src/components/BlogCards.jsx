import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

function BlogCards({ blogs, currentPage, selectedCategory, pageSize }) {
  const filteredBlogs = blogs
    .filter((blogs) => !selectedCategory || blogs.category === selectedCategory)
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);

  console.log(filteredBlogs);
  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
      {filteredBlogs.map((blog) => (
        <Link
          to={`/blogs/${blog.bid}`}
          key={blog.bid}
          className="p-5 shadow-lg rounded cursor-pointer"
        >
          <div>
            <img
              src={`http://localhost:8081/images/${blog.headerPictureUrl}`}
              className="w-full"
              style={{ height: "200px" }}
            />
          </div>

          <h3 className="mt-4 mb-2 font-bold hover:text-blue-600 cursor-pointer">
            {blog.title}
          </h3>

          <p className="mb-1 text-gray-500">
            <FaUser className="inline-flex items-center mr-2" />
            {blog.author}
          </p>
          <p className="text-sm text-gray-700">
            {" "}
            Published At : {blog.publishedAt}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default BlogCards;
