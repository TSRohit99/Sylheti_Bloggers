import React from "react";

function CategorySelection({ onSelectCategory, activeCategory }) {
  const categories = [
    "GhuraGhuri",
    "Khani Review/Recipe",
    "Local News",
    "Others",
  ];

  const handleDropdownChange = (event) => {
    const selectedCategory = event.target.value;
    onSelectCategory(selectedCategory === "ALL" ? null : selectedCategory);
  };

  return (
    <div className="px-3 mb-2 flex justify-around items-center border-b-2 py-3 text-gray-900 font-semibold text-s md:text-xl">
      {/* Dropdown for mobile view */}
      
      <div className="block md:hidden w-full">
      <p>Select Any Category :</p>
        <select
          onChange={handleDropdownChange}
          className="w-full p-2 border rounded"
          value={activeCategory || "ALL"}
        >
          <option value="ALL">ALL</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons for medium and larger screens */}
      <div className="hidden md:flex justify-around items-center w-full">
        <button
          onClick={() => onSelectCategory(null)}
          className={`lg:ml-12 ${activeCategory ? "" : "active-button"}`}
        >
          ALL
        </button>
        {categories.map((category) => (
          <button
            onClick={() => onSelectCategory(category)}
            className={`mr-2 space-x-16 ${
              activeCategory === category ? "active-button" : ""
            }`}
            key={category}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategorySelection;
