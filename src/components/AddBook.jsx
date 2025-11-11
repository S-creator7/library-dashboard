import React, { useState } from "react";
import { addBook } from "../services/bookService";

const AddBook = ({ onClose, onBookAdded }) => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setFieldErrors({ ...fieldErrors, [name]: "" }); // clear field-specific error
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
            await addBook(form);
            onBookAdded();
            onClose();
        } catch (err) {
            setError(err.message || "Failed to add book");
        } finally {
            setLoading(false);
        }
    };

    // Ensure all fields filled before submit
    const isFormValid = Object.values(form).every((v) => v !== "" && v !== null);

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black bg-opacity-25"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Book</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {[
                        { name: "title", label: "Title" },
                        { name: "author", label: "Author" },
                        { name: "publisher", label: "Publisher" },
                        { name: "category", label: "Category" },
                    ].map(({ name, label }) => (
                        <input
                            key={name}
                            type="text"
                            name={name}
                            placeholder={label}
                            value={form[name]}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                    ))}

                    {/* Year */}
                    <div>
                        <input
                            type="number"
                            name="year_of_publication"
                            placeholder="Year of Publication"
                            value={form.year_of_publication}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${fieldErrors.year_of_publication ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {fieldErrors.year_of_publication && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.year_of_publication}</p>
                        )}
                    </div>

                    {/* ISBN */}
                    <div>
                        <input
                            type="text"
                            name="isbn_number"
                            placeholder="ISBN Number"
                            value={form.isbn_number}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${fieldErrors.isbn_number ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {fieldErrors.isbn_number && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.isbn_number}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${fieldErrors.description ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        {fieldErrors.description && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>
                        )}
                    </div>

                    {/* Quantity */}
                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    />

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div className="flex justify-end space-x-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Book"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
