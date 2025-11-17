import api from "./api";

/** 👤 Get Student Profile */
export const getStudentProfile = async (student_id) => {
  try {
    const res = await api.get(`/v1/library/students/${student_id}/profile`);
    return res.data?.resources?.data;
  } catch (err) {
    console.error("❌ Error fetching student profile:", err);
    throw err.response?.data || { message: "Failed to fetch student profile" };
  }
};

/** 🧾 Get a student’s book issue/return history */
export const getStudentHistory = async ({ student_id, page = 1, limit = 10 }) => {
  try {
    const res = await api.get(`/v1/library/students/${student_id}/history`, {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching student history:", err);
    throw err.response?.data || { message: "Failed to fetch student history" };
  }
};