import React, { useEffect, useState, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { getNotifications, markNotificationRead } from "../services/libraryNotifications";

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // 🔹 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications({ limit: 10 });
      const list = data?.data || [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error("❌ Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await markNotificationRead(notif.notification_id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notif.notification_id ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((count) => Math.max(count - 1, 0));
    }

    alert(`📘 ${notif.title}\n\n${notif.message}`);
    // setOpen(false); 
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative focus:outline-none mr-4"
      >
        <FaBell className="text-white text-xl hover:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <button
              onClick={fetchNotifications}
              className="text-xs text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-sm text-gray-500 text-center">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">No notifications yet.</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.notification_id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition ${
                    notif.is_read ? "bg-white" : "bg-gray-100"
                  }`}
                >
                  <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
