import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 };

// ✅ Always use env-based backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const UiDesign = ({ selectedTag, searchQuery }) => {
  const [uiItems, setUiItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/media`);

        // ✅ Filter only UI Design safely
        setUiItems(
          (res.data || []).filter(
            (item) => item.type?.toLowerCase() === "uidesign"
          )
        );
      } catch (err) {
        console.error("Failed to fetch media:", err);
      }
    };

    fetchData();
  }, []);

  let filteredItems = uiItems;

  if (selectedTag && selectedTag !== "All") {
    filteredItems = filteredItems.filter((item) =>
      item.tags?.some(
        (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
      )
    );
  }

  if (searchQuery && searchQuery.trim() !== "") {
    filteredItems = filteredItems.filter((item) =>
      item.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {filteredItems.map((item) => (
          <div
            key={item._id || item.url}
            className="overflow-hidden rounded-lg shadow-lg mb-4"
          >
            <img
              src={
                item.url.startsWith("http")
                  ? item.url
                  : `${API_BASE}${item.url}`
              }
              alt={item.title || "UI Design"}
              className="w-full h-auto object-cover"
              onError={(e) => (e.target.src = "/fallback.png")}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default UiDesign;
