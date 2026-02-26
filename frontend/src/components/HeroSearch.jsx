import { FaSearch } from "react-icons/fa";

export default function HeroSearch({ tags, selectedTag, onTagClick, searchQuery, onSearchChange }) {


    return(
        <section className="bg-gradient-to-r from-cyan-500 to-purple-600 p-10 rounded-2xl text-white text-center max-w-4xl mx-auto mt-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
                Discover. Download. Design.
            </h1>

            {/* Search Box */}
            <div className="flex items-center bg-white rounded-full px-4 py-2 max-w-xl mx-auto">
                    <FaSearch className="text-gray-400 mr-3" />
                <input
                   type="text"
                   placeholder="Search anything..."
                   value={searchQuery}
                   onChange={(e) => onSearchChange(e.target.value)}
                   className="w-full outline-none text-black placeholder:text-gray-400"
                />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
                {tags.map((tag, idx) => (
                   <span
                     key={idx}
                     onClick={() => onTagClick(tag)}
                     className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm shadow cursor-pointer
                               ${selectedTag === tag 
                                ? "bg-yellow-400 text-black" 
                                : "bg-white/80 text-gray-700 hover:bg-blue-800/50 hover:text-white"}`}
                   >
                     <FaSearch className="text-xs" />
                     {tag}
                   </span>
                ))}
            </div>
        </section>

    )
}