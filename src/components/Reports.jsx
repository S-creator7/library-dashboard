import React, { useState, useEffect } from "react";
import { getLibraryReports } from "../services/constantsService";

const Reports = () => {
  const [reportType, setReportType] = useState("issued_books");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const loadReports = async () => {
    if (!reportType) return;
    setLoading(true);
    try {
      const params = { report_type: reportType };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await getLibraryReports(params);
      setReports(res?.resources?.data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [reportType]);

  return (
    <div className="bg-white rounded-lg shadow p-5 mt-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Library Reports</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900"
        >
          <option value="issued_books">Issued Books</option>
          <option value="overdue_books">Overdue Books</option>
          <option value="fine_collection">Fine Collection</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          onClick={loadReports}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate
        </button>
      </div>

      {/* Report Table */}
      {loading ? (
        <p className="text-gray-500 text-center py-6">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No data found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(reports[0] || {}).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {key.replace(/_/g, " ").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="px-4 py-2 text-sm text-gray-700">
                      {val !== null ? val.toString() : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
