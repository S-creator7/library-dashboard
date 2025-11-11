import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fixed at top */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main area (below header) */}
      <div className="flex flex-1">
        {/* Sidebar (optional toggle) */}
        {isSidebarOpen && (
          <Sidebar isOpen={isSidebarOpen} className="w-64 bg-gray-800 text-white" />
        )}

        {/* Page content */}
        <main className="flex-1 p-4 mt-14 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
