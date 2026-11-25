import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import NotificationsDropdown from "./NotificationsDropdown";

const Header = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
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

  // Close dropdown on Escape for keyboard accessibility
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setShowDropdown(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[56px] bg-[#0F172A] border-b border-slate-800 px-5 flex items-center justify-between z-50 shadow-md">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#f86730]/50"
        >
          <FaBars className="text-base sm:text-lg md:text-xl" />
        </button>
        <h1 className="text-base font-semibold text-white tracking-wide">
          Library Portal
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4" ref={dropdownRef}>
        {/* 🔔 Notifications */}
        <NotificationsDropdown />

        {/* 👤 Profile */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="focus:outline-none focus:ring-2 focus:ring-[#f86730]/50 focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded-full transition-transform duration-200 hover:scale-105"
            aria-label="Profile menu"
            aria-haspopup="true"
            aria-expanded={showDropdown}
          >
            {profile?.user_assets?.profile?.[0] ? (
              <img
                src={profile.user_assets.profile[0]}
                alt="Profile"
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-slate-600 hover:border-[#f86730] transition-colors duration-200"
              />
            ) : (
              <FaUserCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-slate-400 cursor-pointer hover:text-[#f86730] transition-colors duration-200" />
            )}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              role="menu"
              className="absolute top-11 sm:top-12 right-0 w-56 sm:w-60 md:w-64 bg-[#1E293B] rounded-2xl shadow-2xl shadow-black/30 border border-slate-700/50 py-1.5 origin-top-right animate-slideDown"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-700/50">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.name || profile?.first_name || "User"}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {profile?.email || "user@example.com"}
                </p>
              </div>

              {/* Menu Items */}
              <ul className="py-1">
                <li
                  role="menuitem"
                  tabIndex={0}
                  className="mx-1.5 my-0.5 px-3 py-2.5 rounded-lg hover:bg-slate-700/50 cursor-pointer flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#f86730]/40"
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate("/profile");
                      setShowDropdown(false);
                    }
                  }}
                >
                  <FaUser className="text-slate-400 text-sm" />
                  <span>View Profile</span>
                </li>
                <li
                  role="menuitem"
                  tabIndex={0}
                  className="mx-1.5 my-0.5 mt-1.5 pt-2.5 px-3 py-2.5 border-t border-slate-700/50 rounded-lg hover:bg-red-500/10 cursor-pointer flex items-center gap-3 text-sm text-red-400 hover:text-red-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400/40"
                  onClick={handleLogout}
                  onKeyDown={(e) => e.key === "Enter" && handleLogout()}
                >
                  <FaSignOutAlt className="text-red-400 text-sm" />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.18s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;