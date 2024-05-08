import React from "react";

function CategorySelection({ onSelectCategory, activeCategory }) {
  const categories = [
    "GhuraGhuri",
    "Khani Review/Recipe",
    "Local News",
    "Others",
  ];
  return (
    <div className="px-3 mb-2 lq:space-x-16 flex justify-around items-center border-b-2 py-3 text-gray-900 font-semibold text-xl">
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
  );
}

export default CategorySelection;
