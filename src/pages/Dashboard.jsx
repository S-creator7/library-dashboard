import React from "react";
import Reports from "../components/Reports";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Welcome to Library Dashboard</h2>
        <p className="text-gray-600">Here’s a quick overview of your library activity.</p>
      </div>

      {/* My Reports Section */}
      <Reports />
    </div>
  );
};

export default Dashboard;
