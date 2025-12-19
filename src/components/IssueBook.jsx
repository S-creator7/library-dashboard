import React, { useState } from "react";
import ConstantSelectors from "./ConstantSelectors";
import { getBooks } from "../services/bookService";
import { issueBook } from "../services/issueService";
import Pagination from "./Pagination";
import { toast } from "react-toastify";

const IssueBook = () => {
  const [filters, setFilters] = useState({
    session_id: "",
    class_id: "",
    section_id: "",
    classroom_id: "",
    student_id: "",
  });

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [dueDate, setDueDate] = useState("");

  // Load books from API
  const loadBooks = async () => {
    if (!filters.classroom_id) return; // Optional: only load when classroom selected
    setLoadingBooks(true);
    try {
      const res = await getBooks({ search, page, limit });
      setBooks(res?.resources?.data || []);
      setTotalPages(res?.resources?.pagination?.total_pages || 1);
    } catch (err) {
      console.error("Error loading books:", err);
    } finally {
      setLoadingBooks(false);
    }
  };

  // Issue selected book
  const handleIssue = async () => {
    if (!selectedBook || !filters.classroom_id || !filters.student_id) {
      toast.warn("Please select a student and a book first.");
      return;
    }

    if (!dueDate) {
      toast.warn("Please select a due date.");
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const payload = {
      book_id: selectedBook.book_id,
      classroom_id: filters.classroom_id,
      student_id: filters.student_id,
      issue_date: today,
      due_date: dueDate,
    };

    setIssuing(true);
    try {
      const res = await issueBook(payload);
      toast.success(res.message || "Book issued successfully!");
      setSelectedBook(null);
      setDueDate("");
      loadBooks(); // Refresh book list if needed
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to issue book.");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold">Issue Book</h1>

      {/* Student Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select Student</h2>
        <ConstantSelectors
          showSession
          showClassroom
          showSection
          showStudent
          values={filters}
          onChange={setFilters}
        />
      </div>

      {/* Book Selection */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Select Book</h2>
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-gray-900 focus:border-gray-900 mb-3"
        />
        <button
          onClick={() => {
            setPage(1);
            loadBooks();
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 mb-3"
        >
          Search
        </button>

        {loadingBooks ? (
          <p className="text-gray-500 text-center">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-gray-500 text-center">No books found</p>
        ) : (
          <div className="max-h-64 overflow-y-auto border rounded-md">
            <ul>
              {books.map((book) => (
                <li
                  key={book.book_id}
                  onClick={() => setSelectedBook(book)}
                  className={`px-4 py-2 border-b cursor-pointer ${
                    selectedBook?.book_id === book.book_id
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{book.title}</span>
                    <span className="text-sm text-gray-500">{book.author}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pagination */}
        {books.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        )}
      </div>

      {/* Due Date Picker */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">
          Select Due Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={dueDate}
          min={new Date().toISOString().split("T")[0]} // prevent past dates
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
      </div>

      {/* Issue Button */}
      <button
        onClick={handleIssue}
        disabled={issuing || !selectedBook || !filters.student_id}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {issuing ? "Issuing..." : "Issue Book"}
      </button>
    </div>
  );
};

export default IssueBook;
