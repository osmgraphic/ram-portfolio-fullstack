// import Logo from "./Logo";
import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa"; // dropdown arrow
import logo from '../assets/Nexvel ai-2-03.png';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center  py-4 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-gray-100" >
      <div className="flex justify-between items-center" style={{width:"100px", height:"15px"}}>
        <img src={logo} alt="Logo" />
      </div>
      <div className="flex items-center gap-6">
        <ul className="flex gap-6 text-base font-normal relative">

          <li className="group relative">
            <Link to="/graphic" className="flex items-center gap-1 hover:underline">
              Graphic <FaChevronDown className="text-xs" />
            </Link>
          </li>
          
          {/* Video */}
          <li className="group relative">
            <Link to="/video" className="flex items-center gap-1 hover:underline">
               Video <FaChevronDown className="text-xs" />
            </Link>
          </li>

          {/* UI/UX */}
          <li className="group relative">
            <Link to="/uidesign" className="flex items-center gap-1 hover:underline">
              UI_UX <FaChevronDown className="text-xs" />
            </Link>
          </li>

          {/* LOGOS */}
          <li className="group relative">
            <Link to="/logos" className="flex items-center gap-1 hover:underline">
              LOGOS <FaChevronDown className="text-xs" />
            </Link>
          </li>
        </ul>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Download CV
        </button>
      </div>  
    </nav>
  );
};

export default Navbar;
