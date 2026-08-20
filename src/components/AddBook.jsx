import React, { useState, useEffect } from "react";
import { addBook, updateBook } from "../services/bookService";
import { 
  FaTimes, 
  FaBook, 
  FaUser, 
  FaBuilding, 
  FaTag, 
  FaCalendarAlt, 
  FaBarcode, 
  FaAlignLeft, 
  FaPlus, 
  FaSave,
  FaSpinner
} from "react-icons/fa";

const AddBook = ({ onClose, onBookAdded, book }) => {
    const [form, setForm] = useState({
        title: "",
        author: "",
        publisher: "",
        year_of_publication: "",
        category: "",
        isbn_number: "",
        description: "",
        quantity: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (book) {
            setForm({
                title: book.title || "",
                author: book.author || "",
                publisher: book.publisher || "",
                year_of_publication: book.year_of_publication || "",
                category: book.category || "",
                isbn_number: book.isbn_number || "",
                description: book.description || "",
                quantity: book.quantity || 1,
            });
        }
    }, [book]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setFieldErrors({ ...fieldErrors, [name]: "" });
    };

    const validateForm = () => {
        const errors = {};
        const currentYear = new Date().getFullYear();

        if (!/^\d{4}$/.test(form.year_of_publication)) {
            errors.year_of_publication = "Enter a valid 4-digit year.";
        } else if (parseInt(form.year_of_publication) > currentYear) {
            errors.year_of_publication = "Year cannot be in the future.";
        }

        if (form.isbn_number.length < 10 || form.isbn_number.length > 14) {
            errors.isbn_number = "ISBN must be between 10–14 characters.";
        }

        if (form.description.length < 14) {
            errors.description = "Description must be at least 14 characters.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);
        try {
            if (book) {
                await updateBook(book.book_id, form);
            } else {
                await addBook(form);
            }
            onBookAdded();
            onClose();
        } catch (err) {
            setError(err.message || "Failed to add book");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = Object.values(form).every((v) => v !== "" && v !== null);
    const isEdit = !!book;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal box */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/25 w-full max-w-md max-h-[90vh] flex flex-col border border-[#E2E8F0] animate-slideUp">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-2xl">
                    <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                        <FaBook className="text-[#f86730]" />
                        {isEdit ? "Edit Book" : "Add New Book"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#64748B] hover:text-[#0F172A] transition-colors hover:bg-slate-100 rounded-lg w-8 h-8 flex items-center justify-center"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#0F172A] flex items-center gap-1.5">
                            <FaBook className="text-[#64748B] text-xs" />
                            Title <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter book title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#0F172A] flex items-center gap-1.5">
                            <FaUser className="text-[#64748B] text-xs" />
                            Author <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            type="text"
                            name="author"
                            placeholder="Enter author name"
                            value={form.author}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
                        />
                    </div>

                    {/* Publisher */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#0F172A] flex items-center gap-1.5">
                            <FaBuilding className="text-[#64748B] text-xs" />
                            Publisher <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            type="text"
                            name="publisher"
                            placeholder="Enter publisher name"
                            value={form.publisher}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#0F172A] flex items-center gap-1.5">
                            <FaTag className="text-[#64748B] text-xs" />
                            Category <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            type="text"
                            name="category"
                            placeholder="Enter category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
                        />
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#0F172A] flex items-center gap-1.5">
                            <FaCalendarAlt className="text-[#64748B] text-xs" />
                            Year of Publication <span className="text-[#EF4444]">*</span>
                        </label>
                        <select
                            name="year_of_publication"
                            value={form.year_of_publication}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 ${
                                fieldErrors.year_of_publication ? "border-[#EF4444]" : "border-[#E2E8F0]"
                            }`}
                        >
                            <option value="">Select Year</option>
                            {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                        {fieldErrors.year_of_publication && (
                            <p className="text-[#EF4444] text-xs mt-1.5 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-[#EF4444]"></span>
                                {fieldErrors.year_of_publication}
                            </p>
                        )}
                    </div>

                    {/* ISBN */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#0F172A] flex items-center gap-1.5">
                            <FaBarcode className="text-[#64748B] text-xs" />
                            ISBN Number <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            type="text"
                            name="isbn_number"
                            placeholder="Enter ISBN number"
                            value={form.isbn_number}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8] ${
                                fieldErrors.isbn_number ? "border-[#EF4444]" : "border-[#E2E8F0]"
                            }`}
                        />
                        {fieldErrors.isbn_number && (
                            <p className="text-[#EF4444] text-xs mt-1.5 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-[#EF4444]"></span>
                                {fieldErrors.isbn_number}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#0F172A] flex items-center gap-1.5">
                            <FaAlignLeft className="text-[#64748B] text-xs" />
                            Description <span className="text-[#EF4444]">*</span>
                        </label>
                        <textarea
                            name="description"
                            placeholder="Enter book description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8] resize-y min-h-[80px] ${
                                fieldErrors.description ? "border-[#EF4444]" : "border-[#E2E8F0]"
                            }`}
                        />
                        {fieldErrors.description && (
                            <p className="text-[#EF4444] text-xs mt-1.5 flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-[#EF4444]"></span>
                                {fieldErrors.description}
                            </p>
                        )}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-[#0F172A] flex items-center gap-1.5">
                            <FaPlus className="text-[#64748B] text-xs" />
                            Quantity <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            min="1"
                            placeholder="Enter quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-[#EF4444] flex items-center gap-2">
                            <span className="text-lg">⚠️</span>
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-[#0F172A] bg-white border border-[#E2E8F0] text-sm font-medium rounded-xl hover:bg-slate-100 active:scale-95 transition-all duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        onClick={handleSubmit}
                        className="px-5 py-2.5 bg-[#f86730] text-white text-sm font-medium rounded-xl hover:bg-[#e35d1f] active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                {isEdit ? "Updating..." : "Adding..."}
                            </>
                        ) : (
                            <>
                                <FaSave className="text-sm" />
                                {isEdit ? "Update Book" : "Add Book"}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
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
                .animate-slideUp {
                    animation: slideUp 0.25s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AddBook;