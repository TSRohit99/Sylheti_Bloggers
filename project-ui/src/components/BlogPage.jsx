import React, { useEffect, useState } from "react";
import BlogCards from "./BlogCards";
import Pagination from "./Pagination";
import CategorySelection from "./CategorySelection";

function BlogPage() {
  const [blogs, setblogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [selectedCategory, setselectedCategory] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isInteractive, setIsInteractive] = useState(false); // New interactive state
  const apiPrefix = 'https://sylheti-bloggers.onrender.com';
  const apiKey = "IamYourFatherDamnNowGiveMeAccess";

  useEffect(() => {
    async function fetchBlogs() {
      let url = `${apiPrefix}/blogs?page=${currentPage}&limit=${pageSize}`;

      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
        },
      });
      const data = await response.json();
      setblogs(data);
    }
    fetchBlogs();
  }, [currentPage, pageSize, selectedCategory, apiKey]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryChange = (category) => {
    setselectedCategory(category);
    setCurrentPage(1);
    setActiveCategory(category);
  };

  // Function to toggle interaction
  const handleInteractionClick = () => {
    setIsInteractive(!isInteractive);
  };

  return (
    <div className="blog-page-container">
      <div>
        <CategorySelection
          onSelectCategory={handleCategoryChange}
          activeCategory={activeCategory}
        />
      </div>

      {/* Interactive Part */}
      <div className="interactive-section my-4 p-4 border border-gray-200 rounded-lg bg-gray-100">
        <h2 className="text-lg font-semibold">
          Since my free Google Cloud tier has expired, the backend is no longer functioning properly.
        </h2>
        <button
          onClick={handleInteractionClick}
          className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          {isInteractive ? "Hide Mobile Version Info" : "Show Mobile Version Info"}
        </button>

        {isInteractive && (
          <div className="interactive-content mt-4 p-4 bg-white border border-gray-300 rounded-lg">
            <p>
              Please check out the mobile version demonstration here:{" "}
              <a
                href="https://github.com/TSRohit99/Sylheti_Bloggers?tab=readme-ov-file#mobile-view-showing-the-latest-features---video"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 underline hover:text-green-600"
              >
                Click Me
              </a>
            </p>
            <p className="mt-2">
              In the mobile version, you'll see features like category selection, pagination,
              and other latest updates.
            </p>
          </div>
        )}
      </div>

      {/* BlogCards Section */}
      <div>
        <BlogCards
          blogs={blogs}
          currentPage={currentPage}
          selectedCategory={selectedCategory}
          pageSize={pageSize}
        />
      </div>

      {/* Pagination */}
      <div>
        <Pagination
          onPageChange={handlePageChange}
          currentPage={currentPage}
          blogs={blogs}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}

export default BlogPage;
