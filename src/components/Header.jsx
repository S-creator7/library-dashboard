import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
// import { UserContext } from "../context/UserContext"; 

const Header = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  // const { profile, setLoading } = useContext(UserContext);
  const profile = JSON.parse(localStorage.getItem("user")) || null;
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = () => {
    // setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      // setLoading(false);
    }, 500);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 text-white p-4 shadow-md flex justify-between items-center">
      {/* Sidebar Toggle */}
      <FaBars
        className="text-2xl cursor-pointer hover:text-gray-300"
        onClick={toggleSidebar}
      />

      {/* Profile Section */}
      <div className="relative flex items-center" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="focus:outline-none"
        >
          {profile?.user_assets?.profile?.[0] ? (
            <img
              src={profile.user_assets.profile[0]}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <FaUserCircle className="w-6 h-6 text-white-400 cursor-pointer" />
          )}
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-12 right-0 w-48 bg-white text-black rounded-lg shadow-lg">
            <ul className="py-2">
              <li
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex items-center space-x-2"
                onClick={() => {
                  navigate("/profile");
                  setShowDropdown(false);
                }}
              >
                <FaUser className="text-gray-900" />
                <span>View Profile</span>
              </li>
              <li
                className="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer flex items-center space-x-2"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
