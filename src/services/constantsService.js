// src/services/constantsService.js
import api from "./api";

/** 📘 Get all sessions */
export const getSessions = async () => {
  try {
    const res = await api.get("/v1/library/sessions");
    return res.data?.resources?.data || [];
  } catch (err) {
    console.error("❌ Error fetching sessions:", err);
    throw err.response?.data || { message: "Failed to fetch sessions" };
  }
};

/** 🏫 Get classrooms for a session */
export const getClassrooms = async (session_id) => {
  try {
    const res = await api.get("/v1/library/classrooms", { params: { session_id } });
    return res.data?.resources?.data || [];
  } catch (err) {
    console.error("❌ Error fetching classrooms:", err);
    throw err.response?.data || { message: "Failed to fetch classrooms" };
  }
};

/** 👩‍🎓 Get students for a classroom */
export const getStudents = async ({ search = "" ,classroom_id, page, limit }) => {
  try {
    const res = await api.get("/v1/library/students", {
      params: { classroom_id, page, limit, search },
    });
    return res.data?.resources || [];
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    throw err.response?.data || { message: "Failed to fetch students" };
  }
};

export const getLibraryReports = async (params) => {
  try {
    const res = await api.get("/v1/library/reports", { params }); 
    return res.data || [];
  } catch (err) {
    console.error("❌ Error fetching library reports:", err);
    throw err.response?.data || { message: "Failed to fetch library reports" };
  }
};