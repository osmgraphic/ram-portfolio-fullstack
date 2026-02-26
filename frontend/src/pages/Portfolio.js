import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Always use env-based backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Portfolio() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/media`);
        setMedia(res.data || []);
      } catch (err) {
        console.error("Failed to fetch media:", err);
      }
    };

    fetchMedia();
  }, []);

  return (
    <div className="portfolio px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Portfolio</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {media.map((item) => (
          <div
            key={item._id}
            className="card bg-white rounded-lg shadow overflow-hidden"
          >
            {item.isVideo ? (
              <video
                src={
                  item.url.startsWith("http")
                    ? item.url
                    : `${API_BASE}${item.url}`
                }
                controls
                className="w-full h-56 object-cover"
              />
            ) : (
              <img
                src={
                  item.url.startsWith("http")
                    ? item.url
                    : `${API_BASE}${item.url}`
                }
                alt={item.title || "Portfolio item"}
                className="w-full h-56 object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="text-lg font-semibold">
                {item.title || "Untitled"}
              </h3>

              {item.tags && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portfolio;
