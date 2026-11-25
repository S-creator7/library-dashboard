import React, { useState } from "react";
import { deleteBook } from "../services/bookService";
import AddBook from "./AddBook";
import { toast } from "react-toastify";
import { FaBook, FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const BookCards = ({ books, onBookUpdated }) => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingBook, setEditingBook] = useState(null);

    const handleDelete = async (book_id) => {
        const confirmed = await confirmToast(
            "Are you sure you want to delete this book?"
        );

        if (!confirmed) return;

        try {
            await deleteBook(book_id);
            toast.success("Book deleted!");
            onBookUpdated();
        } catch (err) {
            toast.error(err.message || "Failed to delete book");
        }
    };

    const handleClose = () => setSelectedBook(null);

    const confirmToast = (message) => {
        return new Promise((resolve) => {
            toast(
                ({ closeToast }) => (
                    <div className="text-sm">
                        <p>{message}</p>

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => {
                                    resolve(true);
                                    closeToast();
                                }}
                                className="px-2 py-1 bg-[#EF4444] text-white rounded"
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

    return (
        <>
            {/* Grid of book cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {books.map((book) => (
                    <div
                        key={book.book_id}
                        className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:shadow-md hover:border-[#f86730]/40 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-[#f86730]/10 flex items-center justify-center text-[#f86730]">
                                <FaBook className="text-lg" />
                            </div>
                            <h3 className="text-base font-semibold text-[#0F172A] truncate group-hover:text-[#f86730] transition-colors">
                                {book.title}
                            </h3>
                        </div>

                        <div className="space-y-1.5 text-sm">
                            <p className="text-[#64748B]">
                                <span className="font-medium text-[#0F172A]">Author:</span> {book.author}
                            </p>
                            <p className="text-[#64748B]">
                                <span className="font-medium text-[#0F172A]">Publisher:</span> {book.publisher}
                            </p>
                            <p className="text-[#64748B]">
                                <span className="font-medium text-[#0F172A]">Year:</span> {book.year_of_publication}
                            </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                            <span className="text-xs text-[#64748B]">
                                Available: <span className="font-semibold text-[#22C55E]">{book.available_quantity || 0}</span>
                                <span className="text-[#94A3B8] mx-1">/</span>
                                <span className="font-medium text-[#0F172A]">{book.quantity}</span>
                            </span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                book.available_quantity > 0
                                    ? "bg-green-50 text-[#22C55E] border border-green-200"
                                    : "bg-red-50 text-[#EF4444] border border-red-200"
                            }`}>
                                {book.available_quantity > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                            <button
                                onClick={() => setSelectedBook(book)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#f86730] bg-[#f86730]/10 border border-[#f86730]/30 rounded-lg hover:bg-[#f86730] hover:text-white transition-all duration-150"
                            >
                                <FaEye className="text-[10px]" />
                                View
                            </button>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setEditingBook(book)}
                                    className="p-1.5 rounded-lg text-[#64748B] hover:text-amber-600 hover:bg-amber-50 transition-all duration-150"
                                    title="Edit"
                                >
                                    <FaEdit className="text-sm" />
                                </button>
                                <button
                                    onClick={() => handleDelete(book.book_id)}
                                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 transition-all duration-150"
                                    title="Delete"
                                >
                                    <FaTrash className="text-sm" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingBook && (
                <AddBook
                    book={editingBook}
                    onClose={() => setEditingBook(null)}
                    onBookAdded={onBookUpdated}
                />
            )}

            {/* View Details Modal */}
            {selectedBook && (
                <div className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
                    <div className="absolute inset-0" onClick={handleClose} />

                    <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/25 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#E2E8F0] animate-slideUp">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-2xl">
                            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                                <FaBook className="text-[#f86730]" />
                                Book Details
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-[#64748B] hover:text-[#0F172A] transition-colors hover:bg-slate-100 rounded-lg w-8 h-8 flex items-center justify-center"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>

                        <div className="p-6 space-y-3">
                            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                                <h3 className="text-xl font-bold text-[#0F172A]">{selectedBook.title}</h3>
                                <p className="text-sm text-[#64748B] mt-1">by {selectedBook.author}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                                    <p className="text-xs text-[#64748B] font-medium">Publisher</p>
                                    <p className="font-medium text-[#0F172A]">{selectedBook.publisher}</p>
                                </div>
                                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                                    <p className="text-xs text-[#64748B] font-medium">Year</p>
                                    <p className="font-medium text-[#0F172A]">{selectedBook.year_of_publication}</p>
                                </div>
                                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                                    <p className="text-xs text-[#64748B] font-medium">Category</p>
                                    <p className="font-medium text-[#0F172A]">{selectedBook.category}</p>
                                </div>
                                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                                    <p className="text-xs text-[#64748B] font-medium">ISBN</p>
                                    <p className="font-medium text-[#0F172A]">{selectedBook.isbn_number}</p>
                                </div>
                                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                                    <p className="text-xs text-[#64748B] font-medium">Total</p>
                                    <p className="font-medium text-[#0F172A]">{selectedBook.quantity}</p>
                                </div>
                                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                                    <p className="text-xs text-[#64748B] font-medium">Available</p>
                                    <p className="font-medium text-[#22C55E]">{selectedBook.available_quantity}</p>
                                </div>
                            </div>

                            {selectedBook.description && (
                                <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                                    <p className="text-xs text-[#64748B] font-medium">Description</p>
                                    <p className="text-sm text-[#0F172A] mt-1">{selectedBook.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 text-xs text-[#64748B]">
                                <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                                    <span className="font-medium">Status:</span>{" "}
                                    <span className={selectedBook.status ? "text-[#22C55E]" : "text-[#EF4444]"}>
                                        {selectedBook.status ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                                    <span className="font-medium">Created:</span>{" "}
                                    {new Date(selectedBook.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] rounded-b-2xl">
                            <button
                                onClick={handleClose}
                                className="px-5 py-2.5 bg-[#f86730] text-white text-sm font-medium rounded-xl hover:bg-[#e35d1f] active:scale-95 transition-all duration-150 shadow-sm"
                            >
                                Close
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
        </>
    );
};

export default BookCards;