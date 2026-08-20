import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaUsers, FaClipboard, FaMoneyBill } from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  const { pathname } = useLocation();

  const menu = [
    { path: "/", label: "Dashboard", icon: FaHome },
    { path: "/books", label: "Books", icon: FaBook },
    { path: "/members", label: "Members", icon: FaUsers },
    { path: "/issue", label: "Issue Books", icon: FaClipboard },
    { path: "/fines", label: "Fines", icon: FaMoneyBill },
  ];

  return (
    <aside
      className={`bg-[#0F172A] text-white transition-all duration-300
      ${isOpen ? "w-64 sm:w-56" : "w-16 sm:w-14"}
      flex flex-col h-[calc(100vh-3rem)] mt-12 fixed md:relative border-r border-slate-700/50`}
    >
      {/* Menu (scrollable) */}
      <nav className="flex-1 overflow-y-auto mt-5">
        <ul className="space-y-2">
          {menu.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300
                  ${isActive ? "bg-[#f86730] text-white" : "hover:bg-slate-800"}`}
                >
                  <item.icon
                    className={`text-lg ${isActive ? "text-white" : "text-gray-300"
                      }`}
                  />
                  {isOpen && (
                    <span className={`${isActive ? "font-semibold" : ""}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Branding (always stuck at bottom) */}
      <footer className="p-3 text-center text-white border-t border-slate-700/50">
        {isOpen && (
          <>
            <p className="font-semibold text-[#f86730]">Aaplishala</p>
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </>
        )}
      </footer>
    </aside>
  );
};

export default Sidebar;