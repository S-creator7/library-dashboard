import React, { useState, useEffect, useRef } from "react";
import { getIssuedBooks, returnBook } from "../services/issueService";
import { getFineReasons, imposeFine } from "../services/fineService";
import Pagination from "./Pagination";
import { toast } from "react-toastify";

const IssuedBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fineModal, setFineModal] = useState({ open: false, book: null });
    const [fineReasons, setFineReasons] = useState([]);
    const [fineData, setFineData] = useState({
        reason_id: "",
        fine_amount: "",
        fine_due_date: "",
        remarks: "",
    });

    const [filters, setFilters] = useState({ search: "", status: "Issued" });
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const searchTimeout = useRef(null);

    // Load issued books
    const loadBooks = async () => {
        setLoading(true);
        try {
            const query = { page, limit, status: filters.status };
            if (filters.search.trim()) query.search = filters.search.trim();
            const res = await getIssuedBooks(query);
            setBooks(res.data || []);
            setTotalPages(res.pagination?.total_pages || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            loadBooks();
            setPage(1);
        }, 500);
        return () => clearTimeout(searchTimeout.current);
    }, [filters.search]);

    useEffect(() => {
        loadBooks();
    }, [filters.status, page, limit]);

    const handleReturn = async (issue_id, book_title) => {
        const confirmed = await confirmToast(
            `Are you sure you want to return "${book_title}"?`
        );

        if (!confirmed) return;

        try {
            const res = await returnBook(issue_id);
            toast.success(res.message || "Book returned successfully.");
            loadBooks();
        } catch (err) {
            console.error("Error returning book:", err);
            toast.error("Failed to return book.");
        }
    };

    // Check if overdue
    const isOverdue = (dueDate, status) => {
        const todayStr = new Date().toISOString().split("T")[0];
        const dueStr = new Date(dueDate).toISOString().split("T")[0];
        return status !== "Returned" && dueStr < todayStr;
    };

    // Open fine modal
    const openFineModal = async (book) => {
        try {
            const reasons = await getFineReasons();
            setFineReasons(reasons);
            setFineModal({ open: true, book });
            setFineData({
                reason_id: "",
                fine_amount: "",
                fine_due_date: "",
                remarks: "",
            });
        } catch (err) {
            console.error("Error loading fine reasons:", err);
        }
    };

    // Submit fine
    const handleFineSubmit = async () => {
        const { reason_id, fine_amount, fine_due_date, remarks } = fineData;
        if (!reason_id || !fine_amount || !fine_due_date) {
            toast.warn("Please fill all required fields.");
            return;
        }
        try {
            const response = await imposeFine({
                transaction_id: fineModal.book.transaction_id,
                student_id: fineModal.book.student_id,
                reason_id: Number(reason_id),
                fine_amount: Number(fine_amount),
                fine_due_date,
                remarks,
            });
            toast.success(response.message || "Fine added successfully.");
            setFineModal({ open: false, book: null });
            loadBooks();
        } catch (err) {
            console.error("Error creating fine:", err);
            toast.error("Failed to create fine.");
        }
    };

    const confirmToast = (message) => {
        return new Promise((resolve) => {
            toast(
                ({ closeToast }) => (
                    <div className="text-sm">
                        <p className="mb-2">{message}</p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    resolve(true);
                                    closeToast();
                                }}
                                className="px-2 py-1 bg-green-600 text-white rounded"
                            >
                                Yes
                            </button>

                            <button
                                onClick={() => {
                                    resolve(false);
                                    closeToast();
                                }}
                                className="px-2 py-1 bg-gray-400 text-white rounded"
                            >
                                No
                            </button>
                        </div>
                    </div>
                ),
                { autoClose: false }
            );
        });
    };
    return (
        <div>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow">
                <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
                <select
                    value={filters.status}
                    onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                    <option value="Issued">Issued</option>
                    <option value="Returned">Returned</option>
                    <option value="Overdue">Overdue</option>
                </select>
            </div>

            {/* Books List */}
            {loading ? (
                <p className="text-gray-500 text-center mt-6">Loading...</p>
            ) : books.length === 0 ? (
                <p className="text-gray-500 text-center mt-6">No issued books found.</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto mt-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Book Title</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Borrower</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Issue Date</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Due Date</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {books.map((b) => (
                                <tr key={b.transaction_id}>
                                    <td className="px-4 py-2 text-sm">{b.book_title}</td>
                                    <td className="px-4 py-2 text-sm">{b.borrower_name}</td>
                                    <td className="px-4 py-2 text-sm">{b.current_status}</td>
                                    <td className="px-4 py-2 text-sm">{b.issue_date}</td>
                                    <td className="px-4 py-2 text-sm">{b.return_date}</td>
                                    <td className="px-4 py-2 text-sm space-x-2">
                                        <button
                                            onClick={() => handleReturn(b.transaction_id, b.book_title)}
                                            disabled={b.current_status === "Returned"}
                                            className={`px-3 py-1 rounded text-white ${b.current_status === "Returned"
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                                }`}
                                        >
                                            {b.current_status === "Returned" ? "Returned" : "Return"}
                                        </button>

                                        {/* Fine button for overdue books */}
                                        {isOverdue(b.return_date, b.current_status) && (
                                            <button
                                                onClick={() => openFineModal(b)}
                                                className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                                            >
                                                Fine
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
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

            {/* Fine Modal */}
            {fineModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-lg font-semibold mb-4">Add Fine - {fineModal.book.book_title}</h2>

                        <label className="block mb-2 text-sm font-medium">Reason</label>
                        <select
                            value={fineData.reason_id}
                            onChange={(e) => setFineData({ ...fineData, reason_id: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                        >
                            <option value="">Select Reason</option>
                            {fineReasons.map((r) => (
                                <option key={r.reason_id} value={r.reason_id}>
                                    {r.reason_name}
                                </option>
                            ))}
                        </select>

                        <label className="block mb-2 text-sm font-medium">Fine Amount</label>
                        <input
                            type="number"
                            value={fineData.fine_amount}
                            onChange={(e) => setFineData({ ...fineData, fine_amount: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                        />

                        <label className="block mb-2 text-sm font-medium">Fine Due Date</label>
                        <input
                            type="date"
                            value={fineData.fine_due_date}
                            onChange={(e) => setFineData({ ...fineData, fine_due_date: e.target.value })}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                        />

                        <label className="block mb-2 text-sm font-medium">Remarks</label>
                        <textarea
                            value={fineData.remarks}
                            onChange={(e) => setFineData({ ...fineData, remarks: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                            rows="3"
                        />

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setFineModal({ open: false, book: null })}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFineSubmit}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Submit Fine
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IssuedBooks;
