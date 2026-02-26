import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ Always use env-based backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Video({ selectedTag, searchQuery }) {
  const [videosItems, setVideosItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/media`);

        // ✅ Filter only video items safely
        setVideosItems(
          (res.data || []).filter(
            (item) => item.type?.toLowerCase() === "video"
          )
        );
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };

    fetchData();
  }, []);

  let filteredItems = videosItems;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id || item.url}
            className="rounded-xl overflow-hidden shadow"
          >
            <div className="relative w-full aspect-[16/9]">
              <iframe
                src={
                  item.url.startsWith("http")
                    ? item.url
                    : `${API_BASE}${item.url}`
                }
                title={item.title || "Video"}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
