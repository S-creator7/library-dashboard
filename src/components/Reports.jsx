import React, { useState, useEffect } from "react";
import { getLibraryReports } from "../services/constantsService";
import { FaFileAlt, FaCalendarAlt, FaFilter, FaDownload, FaSearch, FaSpinner } from "react-icons/fa";

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

  // Get report type label
  const getReportTypeLabel = (type) => {
    const types = {
      issued_books: "Issued Books",
      overdue_books: "Overdue Books",
      fine_collection: "Fine Collection",
    };
    return types[type] || type;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2">
        <FaFileAlt className="text-[#f86730]" />
        <h2 className="text-base font-semibold text-[#0F172A]">Library Reports</h2>
      </div>

      {/* Filters */}
      <div className="px-5 py-4 border-b border-[#E2E8F0] bg-white">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-[#64748B] mb-1">
              <FaFilter className="inline mr-1 text-[10px]" />
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
            >
              <option value="issued_books">Issued Books</option>
              <option value="overdue_books">Overdue Books</option>
              <option value="fine_collection">Fine Collection</option>
            </select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-[#64748B] mb-1">
              <FaCalendarAlt className="inline mr-1 text-[10px]" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
            />
          </div>

          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-[#64748B] mb-1">
              <FaCalendarAlt className="inline mr-1 text-[10px]" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={loadReports}
              disabled={loading}
              className="px-4 py-2 bg-[#f86730] text-white text-sm font-medium rounded-xl hover:bg-[#e35d1f] active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaSearch className="text-xs" />
              )}
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-[#f86730] text-2xl mr-3" />
            <p className="text-[#64748B]">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <FaFileAlt className="text-4xl text-[#94A3B8] mx-auto mb-3" />
            <p className="text-[#64748B] font-medium">No data found</p>
            <p className="text-sm text-[#94A3B8] mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="min-w-full divide-y divide-[#E2E8F0] text-sm">
              <thead className="bg-[#F8FAFC]">
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
                        className="px-4 py-3 text-left font-semibold text-[#0F172A] text-xs uppercase tracking-wider whitespace-nowrap"
                      >
                        {key.replace(/_/g, " ").toUpperCase()}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {reports.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors duration-150">
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
                        const isDateField = [
                          "issue_date",
                          "return_date",
                          "actual_return_date",
                          "created_at",
                          "updated_at",
                        ].includes(key);

                        return (
                          <td key={i} className="px-4 py-3 text-[#0F172A]">
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
    </div>
  );
};

export default Reports;