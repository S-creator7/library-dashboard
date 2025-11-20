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

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


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
      {/* Report Table */}
      {loading ? (
        <p className="text-gray-500 text-center py-6">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No data found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">

            {/* ========= TABLE HEADER ========= */}
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(reports[0])
                  .filter(
                    (key) =>
                      ![
                        "transaction_id",
                        "book_id",
                        "student_id",
                        "session_id",
                        "created_by",
                        "updated_by",
                        "deleted_at",
                        "status",
                      ].includes(key)
                  )
                  .map((key) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left font-semibold text-gray-700"
                    >
                      {key.replace(/_/g, " ").toUpperCase()}
                    </th>
                  ))}
              </tr>
            </thead>

            {/* ========= TABLE BODY ========= */}
            <tbody className="divide-y divide-gray-200">
              {reports.map((row, idx) => (
                <tr key={idx}>
                  {Object.entries(row)
                    .filter(
                      ([key]) =>
                        ![
                          "transaction_id",
                          "book_id",
                          "student_id",
                          "session_id",
                          "created_by",
                          "updated_by",
                          "deleted_at",
                          "status",
                        ].includes(key)
                    )
                    .map(([key, value], i) => {
                      // format dates
                      const isDateField = [
                        "issue_date",
                        "return_date",
                        "actual_return_date",
                        "created_at",
                        "updated_at",
                      ].includes(key);

                      return (
                        <td key={i} className="px-4 py-2 text-gray-700">
                          {isDateField ? formatDate(value) : value || "-"}
                        </td>
                      );
                    })}
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
