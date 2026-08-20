import React, { useState, useEffect, useRef } from "react";
import { getIssuedBooks, returnBook } from "../services/issueService";
import { getFineReasons, imposeFine } from "../services/fineService";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { 
  FaBook, 
  FaSearch, 
  FaFilter, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaMoneyBillWave,
  FaUser,
  FaCalendarAlt,
  FaTimes,
  FaPlus
} from "react-icons/fa";

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

    const isOverdue = (dueDate, status) => {
        const todayStr = new Date().toISOString().split("T")[0];
        const dueStr = new Date(dueDate).toISOString().split("T")[0];
        return status !== "Returned" && dueStr < todayStr;
    };

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
                                className="px-2 py-1 bg-[#22C55E] text-white rounded"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => {
                                    resolve(false);
                                    closeToast();
                                }}
                                className="px-2 py-1 bg-[#94A3B8] text-white rounded"
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

    // Get status badge
    const getStatusBadge = (status) => {
        const configs = {
            'Issued': 'bg-blue-50 text-blue-600 border-blue-200',
            'Returned': 'bg-green-50 text-[#22C55E] border-green-200',
            'Overdue': 'bg-red-50 text-[#EF4444] border-red-200'
        };
        return configs[status] || 'bg-gray-50 text-gray-600 border-gray-200';
    };

    return (
        <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
                        <FaBook className="text-[#f86730]" />
                        Issued Books
                    </h1>
                    <p className="text-sm text-[#64748B] mt-0.5">
                        Manage all issued books and returns
                    </p>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-[#E2E8F0] bg-white">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm" />
                            <input
                                type="text"
                                placeholder="Search by book title or borrower..."
                                value={filters.search}
                                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
                            />
                        </div>
                        <div className="relative">
                            <FaFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm" />
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                                className="pl-10 pr-8 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
                            >
                                <option value="Issued">Issued</option>
                                <option value="Returned">Returned</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books List */}
                <div className="p-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <FaSpinner className="animate-spin text-[#f86730] text-2xl mr-3" />
                            <p className="text-[#64748B]">Loading issued books...</p>
                        </div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-4">
                                <FaBook className="text-4xl text-[#94A3B8]" />
                            </div>
                            <p className="text-base font-medium text-[#0F172A]">No issued books found</p>
                            <p className="text-sm text-[#64748B] mt-1">
                                {filters.search ? "Try adjusting your search" : "No books are currently issued"}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                                <table className="min-w-full divide-y divide-[#E2E8F0]">
                                    <thead className="bg-[#F8FAFC]">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                                <FaBook className="inline mr-1.5 text-[#64748B] text-[10px]" />
                                                Book Title
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                                <FaUser className="inline mr-1.5 text-[#64748B] text-[10px]" />
                                                Borrower
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                                <FaCalendarAlt className="inline mr-1.5 text-[#64748B] text-[10px]" />
                                                Issue Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                                <FaCalendarAlt className="inline mr-1.5 text-[#64748B] text-[10px]" />
                                                Due Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E2E8F0] bg-white">
                                        {books.map((b) => (
                                            <tr key={b.transaction_id} className="hover:bg-[#F8FAFC] transition-colors duration-150">
                                                <td className="px-4 py-3 text-sm font-medium text-[#0F172A]">
                                                    {b.book_title}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[#64748B]">
                                                    {b.borrower_name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(b.current_status)}`}>
                                                        {b.current_status === 'Issued' && <FaClock className="text-[10px]" />}
                                                        {b.current_status === 'Returned' && <FaCheckCircle className="text-[10px]" />}
                                                        {b.current_status === 'Overdue' && <FaTimesCircle className="text-[10px]" />}
                                                        {b.current_status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[#64748B]">
                                                    {b.issue_date}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[#64748B]">
                                                    {b.return_date}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleReturn(b.transaction_id, b.book_title)}
                                                            disabled={b.current_status === "Returned"}
                                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                                                                b.current_status === "Returned"
                                                                    ? "bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed border border-[#E2E8F0]"
                                                                    : "bg-[#22C55E] text-white hover:bg-green-600 active:scale-95"
                                                            }`}
                                                        >
                                                            <FaCheckCircle className="text-[10px]" />
                                                            {b.current_status === "Returned" ? "Returned" : "Return"}
                                                        </button>

                                                        {isOverdue(b.return_date, b.current_status) && (
                                                            <button
                                                                onClick={() => openFineModal(b)}
                                                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#EF4444] text-white hover:bg-red-600 active:scale-95 transition-all duration-150 flex items-center gap-1.5"
                                                            >
                                                                <FaMoneyBillWave className="text-[10px]" />
                                                                Fine
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
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

            {/* Fine Modal */}
            {fineModal.open && (
                <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
                    <div className="absolute inset-0" onClick={() => setFineModal({ open: false, book: null })} />
                    
                    <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/25 w-full max-w-lg border border-[#E2E8F0] animate-slideUp">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-2xl">
                            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                                <FaMoneyBillWave className="text-[#f86730]" />
                                Add Fine
                            </h2>
                            <button
                                onClick={() => setFineModal({ open: false, book: null })}
                                className="text-[#64748B] hover:text-[#0F172A] transition-colors hover:bg-slate-100 rounded-lg w-8 h-8 flex items-center justify-center"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
                                <p className="text-xs text-[#64748B] font-medium">Book</p>
                                <p className="font-semibold text-[#0F172A]">{fineModal.book.book_title}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-[#0F172A]">
                                    Reason <span className="text-[#EF4444]">*</span>
                                </label>
                                <select
                                    value={fineData.reason_id}
                                    onChange={(e) => setFineData({ ...fineData, reason_id: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
                                >
                                    <option value="">Select Reason</option>
                                    {fineReasons.map((r) => (
                                        <option key={r.reason_id} value={r.reason_id}>
                                            {r.reason_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-[#0F172A]">
                                    Fine Amount <span className="text-[#EF4444]">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={fineData.fine_amount}
                                    onChange={(e) => setFineData({ ...fineData, fine_amount: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
                                    placeholder="Enter fine amount"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-[#0F172A]">
                                    Fine Due Date <span className="text-[#EF4444]">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={fineData.fine_due_date}
                                    onChange={(e) => setFineData({ ...fineData, fine_due_date: e.target.value })}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-[#0F172A]">
                                    Remarks
                                </label>
                                <textarea
                                    value={fineData.remarks}
                                    onChange={(e) => setFineData({ ...fineData, remarks: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 resize-y min-h-[60px]"
                                    rows="3"
                                    placeholder="Enter remarks"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] rounded-b-2xl">
                            <button
                                onClick={() => setFineModal({ open: false, book: null })}
                                className="px-5 py-2.5 text-[#0F172A] bg-white border border-[#E2E8F0] text-sm font-medium rounded-xl hover:bg-slate-100 active:scale-95 transition-all duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFineSubmit}
                                className="px-5 py-2.5 bg-[#EF4444] text-white text-sm font-medium rounded-xl hover:bg-red-600 active:scale-95 transition-all duration-150 shadow-sm flex items-center gap-2"
                            >
                                <FaPlus className="text-xs" />
                                Submit Fine
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.15s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.25s ease-out;
                }
            `}</style>
        </div>
    );
};

export default IssuedBooks;