import React, { useState, useEffect, useRef } from "react";
import { getAllFines, updateFine } from "../services/fineService";
import Pagination from "../components/Pagination";
import {
  FaCheck,
  FaTimes,
  FaEdit,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaMoneyBillWave,
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaSave,
  FaUndo
} from "react-icons/fa";
import { toast } from "react-toastify";

const Fines = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    fine_status: "",
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const searchTimeout = useRef(null);

  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({ fine_status: "", remarks: "" });

  const loadFines = async () => {
    setLoading(true);
    try {
      const query = { page, limit };
      if (filters.search) query.search = filters.search;
      if (filters.fine_status) query.fine_status = filters.fine_status;

      const res = await getAllFines(query);
      setFines(res?.resources?.data || []);
      setTotalPages(res?.resources?.pagination?.total_pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      loadFines();
      setPage(1);
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [filters.search]);

  useEffect(() => {
    loadFines();
  }, [filters.fine_status, page, limit]);

  const handleEdit = (fine) => {
    setEditingRow(fine.fine_id);
    setEditData({
      fine_status: fine.fine_status,
      remarks: fine.remarks || "",
    });
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditData({ fine_status: "", remarks: "" });
  };

  const handleSave = async (fine) => {
    const fine_paid_date =
      editData.fine_status === "Paid"
        ? new Date().toISOString().split("T")[0]
        : fine.fine_paid_date;

    try {
      const res = await updateFine(fine.fine_id, {
        fine_status: editData.fine_status,
        fine_paid_date,
        notified_teacher: true,
        remarks: editData.remarks,
      });
      toast.success(res.message || "Fine updated successfully.");
      setEditingRow(null);
      loadFines();
    } catch (err) {
      console.error("Error updating fine:", err);
      toast.error("Failed to update fine.");
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      'Paid': 'bg-green-50 text-[#22C55E] border-green-200',
      'Pending': 'bg-amber-50 text-amber-600 border-amber-200',
      'Waived': 'bg-gray-50 text-gray-600 border-gray-200'
    };
    return configs[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <FaMoneyBillWave className="text-[#f86730]" />
            Fines
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Manage and track library fines
          </p>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-[#E2E8F0] bg-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm" />
              <input
                type="text"
                placeholder="Search by student or book..."
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
              />
            </div>
            <div className="relative sm:w-48">
              <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm" />
              <select
                value={filters.fine_status}
                onChange={(e) => setFilters((f) => ({ ...f, fine_status: e.target.value }))}
                className="w-full pl-10 pr-8 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Waived">Waived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fines Table */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-[#f86730] text-2xl mr-3" />
              <p className="text-[#64748B]">Loading fines...</p>
            </div>
          ) : fines.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-4">
                <FaMoneyBillWave className="text-4xl text-[#94A3B8]" />
              </div>
              <p className="text-base font-medium text-[#0F172A]">No fines found</p>
              <p className="text-sm text-[#64748B] mt-1">
                {filters.search || filters.fine_status ? "Try adjusting your filters" : "All fines are cleared"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                <table className="min-w-full table-fixed divide-y divide-[#E2E8F0]">
                  <thead className="bg-[#F8FAFC]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                        <FaBook className="inline mr-1.5 text-[#64748B] text-[10px]" />
                        Book
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                        <FaUser className="inline mr-1.5 text-[#64748B] text-[10px]" />
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                        Reason
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                        <FaCalendarAlt className="inline mr-1.5 text-[#64748B] text-[10px]" />
                        Due Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                        Remarks
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] bg-white">
                    {fines.map((fine) => {
                      const isEditing = editingRow === fine.fine_id;
                      return (
                        <tr key={fine.fine_id} className="hover:bg-[#F8FAFC] transition-colors duration-150">
                          <td className="px-4 py-3 text-sm text-[#64748B] whitespace-nowrap">
                            {fine.fine_due_date}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#64748B]">
                            {fine.student_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#64748B]">
                            {`${fine.class_name} ${fine.section_name || ""}`}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#0F172A]">
                            ₹{fine.fine_amount}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#64748B]">
                            {fine.reason_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#64748B]">
                            {fine.fine_due_date}
                          </td>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <select
                                value={editData.fine_status}
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...prev,
                                    fine_status: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Waived">Waived</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(fine.fine_status)}`}>
                                {fine.fine_status}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#64748B]">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editData.remarks}
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...prev,
                                    remarks: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
                                placeholder="Remarks..."
                              />
                            ) : (
                              fine.remarks || "-"
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleSave(fine)}
                                  className="p-1.5 rounded-lg bg-green-50 text-[#22C55E] hover:bg-green-100 transition-all duration-150"
                                  title="Save"
                                >
                                  <FaSave className="text-sm" />
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="p-1.5 rounded-lg bg-red-50 text-[#EF4444] hover:bg-red-100 transition-all duration-150"
                                  title="Cancel"
                                >
                                  <FaTimes className="text-sm" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEdit(fine)}
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-150"
                                title="Edit"
                              >
                                <FaEdit className="text-sm" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  limit={limit}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fines;