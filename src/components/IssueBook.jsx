import React, { useEffect, useState } from "react";
import ConstantSelectors from "./ConstantSelectors";
import { getBooks } from "../services/bookService";
import { issueBook } from "../services/issueService";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { 
  FaBook, 
  FaSearch, 
  FaUser, 
  FaCalendarAlt, 
  FaSpinner,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

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
  if (!filters.classroom_id) {
    toast.info("Please select a classroom first");
    return;
  }

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

useEffect(() => {
  if (filters.classroom_id) {
    loadBooks();
  }
}, [filters.classroom_id]);
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

    const today = new Date().toISOString().split("T")[0];

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
     setSelectedBook(null);
setDueDate("");

setFilters({
  session_id: "",
  class_id: "",
  section_id: "",
  classroom_id: "",
  student_id: "",
});

setBooks([]);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to issue book.");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <FaBook className="text-[#f86730]" />
            Issue Book
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Issue a book to a student
          </p>
        </div>

        <div className="p-5 space-y-6">
          {/* Student Selection */}
          <div>
            <h2 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2 mb-3">
              <FaUser className="text-[#f86730]" />
              Select Student
            </h2>
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
          <div className="pt-4 border-t border-[#E2E8F0]">
            <h2 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2 mb-3">
              <FaBook className="text-[#f86730]" />
              Select Book
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm" />
                  <input
                    type="text"
                    placeholder="Search books by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setPage(1);
                  loadBooks();
                }}
                disabled={!filters.classroom_id}
                className="px-4 py-2.5 bg-[#f86730] text-white text-sm font-medium rounded-xl hover:bg-[#e35d1f] active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                <FaSearch className="text-xs" />
                Search Books
              </button>
            </div>

            {loadingBooks ? (
              <div className="flex items-center justify-center py-8">
                <FaSpinner className="animate-spin text-[#f86730] text-xl mr-2" />
                <p className="text-[#64748B]">Loading books...</p>
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-8">
                <FaBook className="text-3xl text-[#94A3B8] mx-auto mb-2" />
                <p className="text-[#64748B] font-medium">No books found</p>
                <p className="text-sm text-[#94A3B8]">
                  {filters.classroom_id ? "Try adjusting your search" : "Please select a classroom first"}
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-[#E2E8F0]">
                  <ul className="divide-y divide-[#E2E8F0]">
                    {books.map((book) => (
                      <li
                        key={book.book_id}
                        onClick={() => {
                          if (book.available_quantity > 0) {
                            setSelectedBook(book);
                          } else {
                            toast.warn("This book is currently out of stock");
                          }
                        }}
                        className={`px-4 py-3 cursor-pointer transition-all duration-150 ${
                          selectedBook?.book_id === book.book_id
                            ? "bg-[#f86730] text-white"
                            : book.available_quantity > 0
                            ? "hover:bg-[#F8FAFC]"
                            : "opacity-50 cursor-not-allowed bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`font-medium ${selectedBook?.book_id === book.book_id ? "text-white" : "text-[#0F172A]"}`}>
                              {book.title}
                            </p>
                            <p className={`text-sm ${selectedBook?.book_id === book.book_id ? "text-white/80" : "text-[#64748B]"}`}>
                              {book.author}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              book.available_quantity > 0
                                ? selectedBook?.book_id === book.book_id
                                  ? "bg-white/20 text-white"
                                  : "bg-green-50 text-[#22C55E] border border-green-200"
                                : "bg-red-50 text-[#EF4444] border border-red-200"
                            }`}>
                              {book.available_quantity > 0 ? `${book.available_quantity} available` : "Out of stock"}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pagination */}
                {books.length > 0 && (
                  <div className="mt-4">
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
                  </div>
                )}
              </>
            )}
          </div>

          {/* Selected Book & Due Date */}
          <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
            {selectedBook && (
              <div className="bg-[#f86730]/5 border border-[#f86730]/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#64748B] font-medium">Selected Book</p>
                  <p className="font-semibold text-[#0F172A]">{selectedBook.title}</p>
                  <p className="text-sm text-[#64748B]">by {selectedBook.author}</p>
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-sm text-[#64748B] hover:text-[#EF4444] transition-colors"
                >
                  Change
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[#0F172A] flex items-center gap-1.5">
                <FaCalendarAlt className="text-[#64748B] text-xs" />
                Due Date <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Issue Button */}
          <div className="pt-4 border-t border-[#E2E8F0]">
            <button
              onClick={handleIssue}
              disabled={issuing || !selectedBook || !filters.student_id || !dueDate}
              className={`w-full sm:w-auto px-6 py-3 text-white text-sm font-medium rounded-xl transition-all duration-150 shadow-sm flex items-center justify-center gap-2 ${
               issuing || !selectedBook || !filters.student_id || !dueDate
                  ? "bg-[#94A3B8] cursor-not-allowed"
                  : "bg-[#22C55E] hover:bg-green-600 active:scale-95"
              }`}
            >
              {issuing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Issuing...
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-sm" />
                  Issue Book
                </>
              )}
            </button>
            {!filters.student_id && selectedBook && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-amber-500"></span>
                Please select a student to issue the book
              </p>
            )}
            {!selectedBook && filters.student_id && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-amber-500"></span>
                Please select a book to issue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBook;