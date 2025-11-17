import api from "./api";

/** 🔔 Get notifications */
export const getNotifications = async ({
  page = 1,
  limit = 10,
  is_read,
  notification_type_id,
}) => {
  try {
    const res = await api.get("/v1/library/notifications", {
      params: { page, limit, is_read, notification_type_id },
    });
    return res.data?.resources;
  } catch (err) {
    console.error("❌ Error fetching notifications:", err);
    throw err.response?.data || { message: "Failed to fetch notifications" };
  }
};

/** 📬 Mark notification as read */
export const markNotificationRead = async (notification_id) => {
  try {
    const res = await api.put(`/v1/library/notifications/${notification_id}/read`);
    return res.data;
  } catch (err) {
    console.error("❌ Error marking notification read:", err);
    throw err.response?.data || { message: "Failed to update notification" };
  }
};
