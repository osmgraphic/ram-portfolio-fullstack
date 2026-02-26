import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 };

// ✅ Always use env-based backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Graphic = ({ selectedTag, searchQuery }) => {
  const [graphicItems, setGraphicItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/media`);

        // ✅ Filter only graphic items safely
        setGraphicItems(
          (res.data || []).filter(
            (item) => item.type?.toLowerCase() === "graphic"
          )
        );
      } catch (err) {
        console.error("Failed to fetch media:", err);
      }
    };

    fetchData();
  }, []);

  let filteredItems = graphicItems;

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
              alt={item.title || "Graphic"}
              className="w-full h-auto object-cover"
              onError={(e) => (e.target.src = "/fallback.png")}
            />
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default Graphic;
