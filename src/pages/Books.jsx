import React, { useEffect, useState } from "react";
import { getBooks, bulkUploadBooks } from "../services/bookService";
import BookCards from "../components/BookCards";
import AddBook from "../components/AddBook";
import Pagination from "../components/Pagination";
import BooksBulkUploadModal from "../components/BooksBulkUploadModal";
import { FaBook, FaSearch, FaPlus, FaUpload, FaSpinner, FaFilter, FaTimes } from "react-icons/fa";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    author: "",
    publisher: "",
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handleBulkUpload = async (file) => {
    if (!file) return;

    setUploadError("");
    setUploading(true);
    try {
      await bulkUploadBooks(file);
      await loadBooks();
      setShowBulkModal(false);
    } catch (error) {
      console.error("Bulk upload failed:", error);
      setUploadError(error?.message || "Failed to bulk upload books. Please check your file and try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1); 
    }, 300);

    return () => clearTimeout(handler);
  }, [filters]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooks({ ...debouncedFilters, page, limit });
      setBooks(res?.resources?.data || []);
      setTotalPages(res?.resources?.pagination?.total_pages || 1);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [debouncedFilters, page, limit]);

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
              <FaBook className="text-[#f86730]" />
              Books
            </h1>
            <p className="text-sm text-[#64748B] mt-0.5">
              Manage your library collection
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] hover:border-[#f86730]/40 transition-all duration-150 flex items-center gap-2"
              onClick={() => setShowBulkModal(true)}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="text-xs" />
                  Bulk Upload
                </>
              )}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#f86730] text-white text-sm font-medium rounded-xl hover:bg-[#e35d1f] active:scale-95 transition-all duration-150 shadow-sm flex items-center gap-2"
            >
              <FaPlus className="text-xs" />
              Add Book
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="p-4 border-b border-[#E2E8F0] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#64748B] text-xs" />
              <span className="text-sm font-medium text-[#0F172A]">Filters</span>
              {hasActiveFilters && (
                <button
                  onClick={() => setFilters({ search: "", category: "", author: "", publisher: "" })}
                  className="text-xs text-[#f86730] hover:underline flex items-center gap-1"
                >
                  <FaTimes className="text-[10px]" />
                  Clear all
                </button>
              )}
            </div>
            <span className="text-xs text-[#64748B]">{books.length} books found</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm" />
              <input
                type="text"
                placeholder="Search by title..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
              />
            </div>
            <input
              type="text"
              placeholder="Category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
            />
            <input
              type="text"
              placeholder="Author"
              value={filters.author}
              onChange={(e) => setFilters({ ...filters, author: e.target.value })}
              className="px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
            />
            <input
              type="text"
              placeholder="Publisher"
              value={filters.publisher}
              onChange={(e) => setFilters({ ...filters, publisher: e.target.value })}
              className="px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] transition-all duration-150 placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        {/* Books List */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-[#f86730] text-2xl mr-3" />
              <p className="text-[#64748B]">Loading books...</p>
            </div>
          ) : books.length > 0 ? (
            <>
              <BookCards books={books} onBookUpdated={loadBooks} />
              <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
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
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-4">
                <FaBook className="text-4xl text-[#94A3B8]" />
              </div>
              <p className="text-base font-medium text-[#0F172A]">No books found</p>
              <p className="text-sm text-[#64748B] mt-1">
                {hasActiveFilters 
                  ? "Try adjusting your filters" 
                  : "Add your first book to get started"}
              </p>
              {!hasActiveFilters && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2.5 bg-[#f86730] text-white text-sm font-medium rounded-xl hover:bg-[#e35d1f] transition-all duration-150 flex items-center gap-2 mx-auto"
                >
                  <FaPlus className="text-xs" />
                  Add Book
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add Book Modal */}
        {showAddModal && (
          <AddBook onClose={() => setShowAddModal(false)} onBookAdded={loadBooks} />
        )}

        {/* Bulk Upload Books Modal */}
        {showBulkModal && (
          <BooksBulkUploadModal
            isOpen={showBulkModal}
            onClose={() => setShowBulkModal(false)}
            onUpload={handleBulkUpload}
            uploading={uploading}
            error={uploadError}
            templateUrl={"/templates/books.xlsx"}
          />
        )}
      </div>
    </div>
  );
};

export default Books;