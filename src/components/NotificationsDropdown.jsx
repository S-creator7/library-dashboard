import React, { useEffect, useState, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { getNotifications } from "../services/notificationService";

const notificationTypes = [
  "ALL",
  "library_due_reminder",
  "library_overdue_alert",
  "library_fine_notification",
  "library_new_book",
  "library_issue_confirmation",
  "library_return_confirmation",
];

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationType, setNotificationType] = useState("ALL");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dropdownRef = useRef(null);

  // Fetch when dropdown opens OR filters change
  useEffect(() => {
    if (open) {
      resetAndFetch();
    }
  }, [open, notificationType, startDate, endDate]);

  const resetAndFetch = () => {
    setPage(1);
    setNotifications([]);
    fetchNotifications(1, true);
  };

  const fetchNotifications = async (pageNum = 1, reset = false) => {
    if (loading) return;
    setLoading(true);

    const params = {
      limit: 10,
      page: pageNum,
      notification_type: notificationType,
    };

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const res = await getNotifications(params);

    const newData = res.data || [];

    if (reset) {
      setNotifications(newData);
    } else {
      setNotifications((prev) => [...prev, ...newData]);
    }

    setHasMore(newData.length >= 10);
    setLoading(false);
  };

  const loadMore = () => {
    if (!hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchNotifications(next);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " • " +
      d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative text-white hover:text-gray-300"
      >
        <FaBell className="text-xl" />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[420px] bg-white shadow-xl rounded-xl border z-50 overflow-hidden">
          <div className="p-3 border-b font-semibold text-gray-700">
            Notifications
          </div>

          {/* ===== Filters Section ===== */}
          {/* ===== Filters Section ===== */}
          <div className="px-3 py-3 border-b space-y-3 bg-gray-50">

            {/* Notification Type — NO SCROLLBAR BUT STILL HORIZONTAL SCROLL POSSIBLE */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
              <div className="flex gap-2">
                {notificationTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setNotificationType(type)}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border transition
          ${notificationType === type
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {type.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>


            {/* Date Filters - both in one row, aligned perfectly */}
            <div className="flex items-center gap-4">
              {/* Start Date */}
              <div className="flex items-center w-1/2 gap-2">
                <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Start:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate || today}
                  className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>

              {/* End Date */}
              <div className="flex items-center w-1/2 gap-2">
                <label className="text-xs font-medium text-gray-600 whitespace-nowrap">End:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  max={today}
                  min={startDate}
                  className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>




            {/* Reset Button */}
            {(startDate || endDate) && (
              <button
                className="text-blue-600 text-xs underline"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Reset Date Filters
              </button>
            )}
          </div>


          {/* ===================== Notifications List ===================== */}
          <ul className="max-h-80 overflow-y-auto divide-y">
            {loading && notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm text-center">
                Loading...
              </p>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center flex flex-col items-center text-gray-500">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
                  alt="empty"
                  className="w-20 opacity-70 mb-2"
                />
                No notifications found.
              </div>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.notification_id}
                  className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="font-semibold text-sm text-gray-800">
                    {n.title}
                  </div>

                  <div className="text-xs text-gray-600 mt-1">
                    {n.message}
                  </div>

                  <div className="mt-2 text-[11px] text-gray-500">
                    <span className="font-semibold">To:</span>{" "}
                    <span className="text-gray-700">{n.recipient_name}</span>{" "}
                    •{" "}
                    <span className="uppercase">{n.recipient_type}</span>
                  </div>

                  <div className="text-[11px] text-gray-400 mt-1">
                    {formatDateTime(n.created_at)}
                  </div>
                </li>
              ))
            )}
          </ul>

          {/* Load More */}
          {hasMore && (
            <div
              onClick={loadMore}
              className="p-3 text-blue-600 text-sm text-center hover:bg-gray-100 cursor-pointer"
            >
              Load More
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
