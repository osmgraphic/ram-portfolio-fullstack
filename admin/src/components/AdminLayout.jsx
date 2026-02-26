import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 };

// ✅ ENV-BASED API
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Type options and tags
const typeOptions = {
  Graphic: ["illustration", "poster", "flyer", "digital art"],
  Video: ["intro", "trailer", "ad", "animation"],
  UiDesign: ["wireframe", "mockup", "landingpage", "prototype"],
  Logos: ["minimal", "vintage", "mascot", "typography"],
};

const AdminLayout = () => {
  const [media, setMedia] = useState([]);
  const [type, setType] = useState("Graphic");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  /* ================= FETCH MEDIA ================= */
  const fetchMedia = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/media`);
      setMedia(res.data || []);
    } catch (err) {
      console.error(err);
      showNotification("❌ Failed to fetch media");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  /* ================= MEDIA UPLOAD ================= */
  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      if (!file && !externalUrl)
        return showNotification("Select a file or external link");
      if (!tags.length)
        return showNotification("Select at least one tag");

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type.toLowerCase());
        formData.append("tags", tags.join(","));
        formData.append("isVideo", type === "Video");

        await axios.post(`${API_BASE}/api/media/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        showNotification("✅ File uploaded successfully");
      } else {
        await axios.post(`${API_BASE}/api/media/upload-url`, {
          type: type.toLowerCase(),
          tags,
          url: externalUrl,
          isVideo: type === "Video",
        });

        showNotification("✅ External media added successfully");
      }

      setFile(null);
      setExternalUrl("");
      setTags([]);
      fetchMedia();
    } catch (err) {
      console.error(err);
      showNotification("❌ Upload failed");
    }
  };

  /* ================= DELETE MEDIA ================= */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/media/${id}`);
      setMedia((prev) => prev.filter((m) => m._id !== id));
      showNotification("🗑️ Deleted successfully");
    } catch (err) {
      console.error(err);
      showNotification("❌ Delete failed");
    }
  };

  /* ================= BROCHURE UPLOAD ================= */
  const handleBrochureUpload = async (e) => {
    e.preventDefault();

    const file = e.target.brochure.files[0];
    if (!file) return showNotification("Please select a PDF brochure");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE}/api/brochure/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showNotification("📄 Brochure uploaded / updated successfully");
    } catch (err) {
      console.error(err);
      showNotification("❌ Brochure upload failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* BROCHURE */}
      <form
        onSubmit={handleBrochureUpload}
        className="mb-8 p-4 bg-gray-900 border border-yellow-500 rounded"
      >
        <h2 className="text-lg font-semibold mb-2 text-yellow-400">
          Upload / Replace Brochure (PDF)
        </h2>

        <input
          type="file"
          name="brochure"
          accept="application/pdf"
          className="block mb-3 text-sm text-gray-300"
        />

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-medium"
        >
          Upload Brochure
        </button>
      </form>

      {/* MEDIA UPLOAD */}
      <form
        onSubmit={handleUpload}
        className="mb-6 space-y-4 p-4 bg-gray-800 rounded"
      >
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setTags([]);
          }}
          className="border p-2 w-full rounded text-white bg-gray-700"
        >
          {Object.keys(typeOptions).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-700 p-2 rounded">
          {typeOptions[type].map((tg) => (
            <label key={tg} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={tags.includes(tg)}
                onChange={(e) =>
                  e.target.checked
                    ? setTags([...tags, tg])
                    : setTags(tags.filter((t) => t !== tg))
                }
              />
              <span className="capitalize">{tg}</span>
            </label>
          ))}
        </div>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm text-gray-200 bg-gray-900 rounded p-2"
        />

        <input
          type="url"
          placeholder="Or paste an external URL"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          className="border p-2 w-full rounded text-white bg-gray-900"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Upload Media
        </button>
      </form>

      {/* MEDIA GALLERY */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {media.map((item) => (
          <div
            key={item._id}
            className="bg-gray-700 rounded overflow-hidden mb-4"
          >
            {item.isVideo ? (
              <video
                src={
                  item.url.startsWith("http")
                    ? item.url
                    : `${API_BASE}${item.url}`
                }
                controls
                className="w-full h-auto object-cover"
              />
            ) : (
              <img
                src={
                  item.url.startsWith("http")
                    ? item.url
                    : `${API_BASE}${item.url}`
                }
                alt={item.title}
                className="w-full h-auto object-cover"
              />
            )}

            <div className="p-2">
              <p className="text-sm">Type: {item.type}</p>
              <p className="text-xs text-gray-300">
                Tags: {(item.tags || []).join(", ")}
              </p>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 mt-2 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default AdminLayout;
