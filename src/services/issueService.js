import api from "./api";

/** 📗 Issue a new book */
export const issueBook = async (payload) => {
  try {
    const res = await api.post("/v1/library/issues", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error issuing book:", err);
    throw err.response?.data || { message: "Failed to issue book" };
  }
};

/** 📘 Return a book */
export const returnBook = async (issue_id) => {
  try {
    const res = await api.put(`/v1/library/issues/${issue_id}/return`);
    return res.data;
  } catch (err) {
    console.error("❌ Error returning book:", err);
    throw err.response?.data || { message: "Failed to return book" };
  }
};


/** 📚 Get list of issued books with pagination, status, and search */
export const getIssuedBooks = async ({ page = 1, limit = 10, status = "Issued", search}) => {
  try {
    const res = await api.get("/v1/library/issues", {
      params: { page, limit, status, search },
    });
    return res.data?.resources;
  } catch (err) {
    console.error("❌ Error fetching issued books:", err);
    throw err.response?.data || { message: "Failed to fetch issued books" };
  }
};