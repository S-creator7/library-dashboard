import React, { useState } from "react";
import { deleteBook } from "../services/bookService";
import AddBook from "./AddBook";
const BookCards = ({ books, onBookUpdated }) => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingBook, setEditingBook] = useState(null);

    const handleDelete = async (book_id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await deleteBook(book_id);
            onBookUpdated();
        } catch (err) {
            alert(err.message || "Failed to delete book");
        }
    };
    const handleClose = () => setSelectedBook(null);

    return (
        <>
            {/* Grid of book cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                    <div
                        key={book.book_id}
                        className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">Author: {book.author}</p>
                        <p className="text-sm text-gray-600">Publisher: {book.publisher}</p>
                        <p className="text-sm text-gray-500">Year: {book.year_of_publication}</p>
                        <span className="text-xs text-gray-500"> Available: {book.available_quantity || 0}/{book.quantity} </span>
                        <div className="mt-3 flex justify-between items-center">
                            <button
                                onClick={() => setSelectedBook(book)}
                                className="text-sm text-gray-900 font-medium hover:underline"
                            >
                                View
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingBook(book)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(book.book_id)}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingBook && (
                <AddBook
                    book={editingBook}
                    onClose={() => setEditingBook(null)}
                    onBookAdded={onBookUpdated}
                />
            )}
            {/* Modal for viewing details */}
            {selectedBook && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-20 flex justify-center items-center z-50">
                    {/* Click outside to close */}
                    <div
                        className="absolute inset-0"
                        onClick={handleClose}
                    />

                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh] z-10">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            {selectedBook.title}
                        </h2>

                        <div className="space-y-2 text-sm text-gray-700">
                            <p><strong>Author:</strong> {selectedBook.author}</p>
                            <p><strong>Publisher:</strong> {selectedBook.publisher}</p>
                            <p><strong>Year of Publication:</strong> {selectedBook.year_of_publication}</p>
                            <p><strong>Category:</strong> {selectedBook.category}</p>
                            <p><strong>ISBN Number:</strong> {selectedBook.isbn_number}</p>
                            <p><strong>Description:</strong> {selectedBook.description}</p>
                            <p><strong>Quantity:</strong> {selectedBook.quantity}</p>
                            <p><strong>Available Quantity:</strong> {selectedBook.available_quantity}</p>
                            <p><strong>Status:</strong> {selectedBook.status ? "Active" : "Inactive"}</p>
                            <p><strong>Created By:</strong> {selectedBook.created_by}</p>
                            <p><strong>Updated By:</strong> {selectedBook.updated_by}</p>
                            <p><strong>Created At:</strong> {new Date(selectedBook.created_at).toLocaleString()}</p>
                            <p><strong>Updated At:</strong> {new Date(selectedBook.updated_at).toLocaleString()}</p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default BookCards;
