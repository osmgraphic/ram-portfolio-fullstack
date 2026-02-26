import React, { useState, useEffect } from "react";
import axios from "axios";

// ✅ Always use env-based backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function MediaPage({ category, selectedTag }) {
  const [mediaItems, setMediaItems] = useState([]);

  const normalize = (str = "") =>
    str.toLowerCase().replace(/\s+/g, "");

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/media`);
        setMediaItems(res.data || []);
      } catch (err) {
        console.error("Failed to fetch media:", err);
      }
    };

    fetchMedia();
  }, []);

  const filteredItems = mediaItems.filter((item) => {
    const matchesCategory =
      category === "All" ||
      normalize(item.type) === normalize(category);

    const matchesTag =
      selectedTag === "All" ||
      item.tags?.some(
        (tag) => normalize(tag) === normalize(selectedTag)
      );

    return matchesCategory && matchesTag;
  });

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredItems.map((item, index) => (
        <div
          key={item._id || index}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {item.isVideo ? (
            <iframe
              src={
                item.url.startsWith("http")
                  ? item.url
                  : `${API_BASE}${item.url}`
              }
              className="w-full h-64"
              frameBorder="0"
              allowFullScreen
              title={item.title || "Video"}
            />
          ) : (
            <img
              src={
                item.url.startsWith("http")
                  ? item.url
                  : `${API_BASE}${item.url}`
              }
              alt={item.title || "Media"}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-4 flex flex-wrap gap-2 mt-2">
            {item.tags?.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-gray-200 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
