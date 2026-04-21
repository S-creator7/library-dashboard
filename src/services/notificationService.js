import api from "./api";

/** 🔔 Get notifications */

export const getNotifications = async ({
  page = 1,
  limit = 10,
  notification_type = "ALL",
  start_date,
  end_date,
}) => {
  try {
    const params = { page, limit, notification_type };

    // add only if not empty
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;

    const response = await api.get("/v1/library/notifications/sent", {
      params,
    });

    return response.data?.resources || { data: [], pagination: {} };
  } catch (error) {
    console.error("Notifications Error:", error.response?.data || error.message);
    return { data: [] };
  }
};
