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
  const apiPrefix = 'https://sylheti-bloggers.onrender.com'
  // const apiPrefix = 'http://localhost:8081'
  // const apiKey = import.meta.env.VITE_API_KEY_SELF
  const apiKey="IamYourFatherDamnNowGiveMeAccess";

  useEffect(() => {
    async function fetchBlogs() {
      let url = `${apiPrefix}/blogs?page=${currentPage}&limit=${pageSize}`;

      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }

      const response = await fetch(url, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey 
        }
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

  return (
    <div className="blog-page-container">
      <div>
        <CategorySelection
          onSelectCategory={handleCategoryChange}
          activeCategory={activeCategory}
        />
      </div>

      {/* BlogCards Section  */}

      <div>
        <BlogCards
          blogs={blogs}
          currentPage={currentPage}
          selectedCategory={selectedCategory}
          pageSize={pageSize}
        />
      </div>

      {/* Pagination  */}

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
