import api from "./api";

/**
 * ➕ Add a new book
 * POST /v1/library/books
 * @param {Object} bookData - Book details (title, author, publisher, etc.)
 */
export const addBook = async (bookData) => {
    try {
        const response = await api.post("/v1/library/books", bookData);
        return response.data;
    } catch (error) {
        console.error("❌ Error adding book:", error);
        throw (
            error.response?.data || {
                message: "Failed to add book. Please check your input and try again.",
            }
        );
    }
};

/**
 * 📚 Get all books
 * GET /v1/library/books
 * @param {Object} filters - Optional query parameters (search, category, author, publisher, status, page, limit)
 * Example:
 * { search: 'math', author: 'John', page: 2, limit: 20 }
 */
export const getBooks = async (filters = {}) => {
    try {
        const params = {
            page: filters.page || 1,
            limit: filters.limit || 10,
            ...filters,
        };
        const response = await api.get("/v1/library/books", {
            params
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching books:", error);
        throw (
            error.response?.data || {
                message: "Failed to fetch books. Please try again later.",
            }
        );
    }
};
