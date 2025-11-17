import React, { useEffect, useState } from "react";
import { getStudentHistory } from "../services/memberService";
import Pagination from "./Pagination";

const StudentHistory = ({ studentId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (studentId) {
            setLoading(true);
            getStudentHistory({ student_id: studentId, page, limit })
                .then((res) => {
                    setHistory(res?.resources?.data || []);
                    setTotalPages(res?.resources?.pagination?.total_pages || 1);
                })
                .finally(() => setLoading(false));
        } else {
            setHistory([]);
        }
    }, [studentId, page, limit]);

    if (!studentId) {
        return <p className="text-gray-500 text-sm">Select a student to view history</p>;
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-lg font-semibold text-gray-800">Issue / Return History</h2>
            </div>

            {loading ? (
                <p className="text-gray-500 text-sm">Loading history...</p>
            ) : history.length === 0 ? (
                <p className="text-gray-500 text-sm">No records found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-2 border">Book Title</th>
                                <th className="px-4 py-2 border">Author</th>
                                <th className="px-4 py-2 border">Issue Date</th>
                                <th className="px-4 py-2 border">Return Date</th>
                                <th className="px-4 py-2 border">Status</th>
                                <th className="px-4 py-2 border">Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.transaction_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{item.book_title}</td>
                                    <td className="px-4 py-2 border">{item.author}</td>
                                    <td className="px-4 py-2 border">{item.issue_date}</td>
                                    <td className="px-4 py-2 border">
                                        {item.actual_return_date || item.return_date || "-"}
                                    </td>
                                    <td
                                        className={`px-4 py-2 border font-medium ${item.transaction_status === "Issued"
                                            ? "text-blue-600"
                                            : "text-green-600"
                                            }`}
                                    >
                                        {item.transaction_status}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {item.fine_amount ? `₹${item.fine_amount} - ${item.fine_status}` : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {history.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        limit={limit}
                        onPageChange={(newPage) => setPage(newPage)}
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

export default StudentHistory;
