import React, { useState, useEffect, useRef } from "react";
import { getAllFines, updateFine } from "../services/fineService";
import Pagination from "../components/Pagination";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
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

  // Track which row is being edited
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({ fine_status: "", remarks: "" });

  // Fetch fines
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

  // Start editing a fine
  const handleEdit = (fine) => {
    setEditingRow(fine.fine_id);
    setEditData({
      fine_status: fine.fine_status,
      remarks: fine.remarks || "",
    });
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingRow(null);
    setEditData({ fine_status: "", remarks: "" });
  };

  // Save update
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

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900"
        />
        <select
          value={filters.fine_status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, fine_status: e.target.value }))
          }
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Waived">Waived</option>
        </select>
      </div>

      {/* Fines Table */}
      {loading ? (
        <p className="text-gray-500 text-center mt-6">Loading...</p>
      ) : fines.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">No fines found.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Book Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Student
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Class
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Roll
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Fine Amount
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Reason
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Due Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Remarks
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fines.map((fine) => {
                const isEditing = editingRow === fine.fine_id;
                return (
                  <tr key={fine.fine_id}>
                    <td className="px-4 py-2 text-sm">{fine.book_title}</td>
                    <td className="px-4 py-2 text-sm">{fine.student_name}</td>
                    <td className="px-4 py-2 text-sm">{`${fine.class_name} ${fine.section_name || ""}`}</td>
                    <td className="px-4 py-2 text-sm">{fine.roll_number || "-"}</td>
                    <td className="px-4 py-2 text-sm">₹{fine.fine_amount}</td>
                    <td className="px-4 py-2 text-sm">{fine.reason_name}</td>
                    <td className="px-4 py-2 text-sm">{fine.fine_due_date}</td>

                    <td className="px-4 py-2 text-sm">
                      {isEditing ? (
                        <select
                          value={editData.fine_status}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              fine_status: e.target.value,
                            }))
                          }
                          className="border border-gray-300 rounded-lg px-2 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Waived">Waived</option>
                        </select>
                      ) : (
                        <span
                          className={`font-semibold ${
                            fine.fine_status === "Paid"
                              ? "text-green-600"
                              : fine.fine_status === "Pending"
                              ? "text-yellow-600"
                              : "text-gray-500"
                          }`}
                        >
                          {fine.fine_status}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2 text-sm">
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
                          className="border border-gray-300 rounded-lg px-2 py-1 w-full"
                          placeholder="Remarks..."
                        />
                      ) : (
                        fine.remarks || "-"
                      )}
                    </td>

                    <td className="px-4 py-2 text-sm">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(fine)}
                            className="text-green-600 hover:text-green-800"
                            title="Save"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-800"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(fine)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
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
      )}
    </div>
  );
};

export default Fines;
