import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Nexvel ai-2.png"; 

export default function Navbar({ setCategory }) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (category, path) => {
    setCategory(category); // ✅ updates tags in App.jsx
    navigate(path); // ✅ navigates without page reload
    setNavbarOpen(false); // ✅ close mobile menu after click
  };

  return (
    <nav className="bg-black1 border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        
        {/* Logo */}
        <Link to="/" onClick={() => handleNavClick("home", "/")} className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-12" alt="Nexvel AI Logo" />
        </Link>
        

        {/* Mobile menu button */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden 
                     hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 
                     dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Nav Links */}
        <div className={`${navbarOpen ? "block" : "hidden"} w-full md:block md:w-auto`}>
          <ul className="flex items-center flex-col font-medium p-4 md:p-0 mt-4 border border-black1 rounded-lg 
                         bg-black1 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 
                         md:bg-white bg-none md:dark:bg-black1">
            {/* Home */}
            <li>
              <button
                onClick={() => handleNavClick("home", "/")}
                className="flex items-center gap-1 py-2 px-3 text-gray-900 rounded-sm 
                           hover:text-[#FFD700] md:p-0 dark:text-white"
              >
                Home
              </button>
            </li>

            {/* Graphic */}
            <li>
              <button
                onClick={() => handleNavClick("graphic", "/graphic")}
                className="flex items-center gap-1 py-2 px-3 text-gray-900 rounded-sm 
                           hover:text-[#FFD700] md:p-0 dark:text-white"
              >
                Graphic
              </button>
            </li>

            {/* Video */}
            <li>
              <button
                onClick={() => handleNavClick("video", "/video")}
                className="flex items-center gap-1 py-2 px-3 text-gray-900 rounded-sm 
                           hover:text-[#FFD700] md:p-0 dark:text-white"
              >
                Video
              </button>
            </li>

            {/* UI/UX */}
            <li>
              <button
                onClick={() => handleNavClick("uidesign", "/uidesign")}
                className="flex items-center gap-1 py-2 px-3 text-gray-900 rounded-sm 
                           hover:text-[#FFD700] md:p-0 dark:text-white"
              >
                UI_UX
              </button>
            </li>

            {/* Logos */}
            <li>
              <button
                onClick={() => handleNavClick("logos", "/logos")}
                className="flex items-center gap-1 py-2 px-3 text-gray-900 rounded-sm 
                           hover:text-[#FFD700] md:p-0 dark:text-white"
              >
                LOGOS
              </button>
            </li>

            {/* Get Started Button */}
            <li>
              <button
                type="button"
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/brochure/download`;
                }}
                className="text-gray-950 bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FF8C00]
                           hover:brightness-110 focus:ring-4 focus:outline-none focus:ring-yellow-300
                           font-medium rounded-lg text-sm px-4 py-2 text-center
                           dark:focus:ring-yellow-800"
              >
                Download Resume
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
