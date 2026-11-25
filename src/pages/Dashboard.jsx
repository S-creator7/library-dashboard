import React from "react";
import Reports from "../components/Reports";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">Welcome to Library Dashboard</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Here’s a quick overview of your library activity.</p>
      </div>

      {/* My Reports Section */}
      <Reports />
    </div>
  );
};

export default Dashboard;
