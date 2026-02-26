import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home3.jsx";
import Graphic from "./pages/Graphic.jsx";
import Video from "./pages/Video.jsx";
import UiDesign from "./pages/UiDesign.jsx";
import Logos from "./pages/Logos.jsx";


import Navbar from "./components/Navbar.jsx";
import HeroSearch from "./components/HeroSearch.jsx";

import "./index.css";

function App() {
  const [tags, setTags] = useState(["All", "graphic", "video", "uidesign", "logos"]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [currentCategory, setCurrentCategory] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryTags = {
    home: ["All", "graphic", "video", "uidesign", "logos"],
    graphic: ["All", "Illustration", "Poster", "Flyer", "Digital Art"],
    video: ["All", "Intro", "Trailer", "Ad", "Animation"],
    uidesign: ["All", "Wireframe", "Mockup", "Landing Page", "Prototype"],
    logos: ["All", "Minimal", "Vintage", "Mascot", "Typography"],
  };

  const handleSetCategory = (category) => {
    setCurrentCategory(category);
    setTags(categoryTags[category] || ["All"]);
    setSelectedTag("All"); // Reset to default when category changes
  };

  return (
    <>
      <Navbar setCategory={handleSetCategory} />

      <HeroSearch
        tags={tags}
        selectedTag={selectedTag}
        onTagClick={(tag) => setSelectedTag(tag)}
        searchQuery={searchQuery}
        onSearchChange={(query) => setSearchQuery(query)}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home selectedTag={selectedTag} searchQuery={searchQuery} category="home" />} />
        <Route path="/graphic" element={<Graphic selectedTag={selectedTag} searchQuery={searchQuery} category="graphic" />} />
        <Route path="/video" element={<Video selectedTag={selectedTag} searchQuery={searchQuery} category="video" />} />
        <Route path="/uidesign" element={<UiDesign selectedTag={selectedTag} searchQuery={searchQuery} category="uidesign" />} />
        <Route path="/logos" element={<Logos selectedTag={selectedTag} searchQuery={searchQuery} category="logos" />} />
      </Routes>
    </>
  );
}

export default App;
