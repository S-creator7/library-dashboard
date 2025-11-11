import React, { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import BookCards from "../components/BookCards";
import AddBook from "../components/AddBook";
import Pagination from "../components/Pagination";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    author: "",
    publisher: "",
  });
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooks({ ...filters, page, limit });
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
  }, [filters, page, limit]);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Books</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
        >
          + Add Book
        </button>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        <input
          type="text"
          placeholder="Author"
          value={filters.author}
          onChange={(e) => setFilters({ ...filters, author: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
        <input
          type="text"
          placeholder="Publisher"
          value={filters.publisher}
          onChange={(e) => setFilters({ ...filters, publisher: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
        />
      </div>

      {/* Books List */}
      {loading ? (
        <p className="text-center text-gray-600 mt-10">Loading books...</p>
      ) : books.length > 0 ? (
        <>
          <BookCards books={books} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1); // Reset to first page when limit changes
            }}
          />
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">No books found</p>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <AddBook onClose={() => setShowAddModal(false)} onBookAdded={loadBooks} />
      )}
    </div>
  );
};

export default Books;
