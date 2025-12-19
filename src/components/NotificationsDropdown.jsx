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
        <div className="fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-opacity-25"
            onClick={() => setOpen(false)}
          />
          
          <div
            className={`absolute top-0 right-0 h-screen w-[420px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b font-semibold text-gray-700 text-lg flex justify-between items-center">
                <span>Notifications</span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ×
                </button>
              </div>

              <div className="px-4 py-3 border-b space-y-3 bg-gray-50">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <div className="flex gap-2">
                    {notificationTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setNotificationType(type)}
                        className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition ${
                          notificationType === type
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {type.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center w-1/2 gap-2">
                    <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Start:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate || today}
                      className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>

                  <div className="flex items-center w-1/2 gap-2">
                    <label className="text-xs font-medium text-gray-600 whitespace-nowrap">End:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      max={today}
                      min={startDate}
                      className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                </div>

                {(startDate || endDate) && (
                  <button
                    className="text-blue-600 text-xs underline hover:text-blue-800"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                  >
                    Reset Date Filters
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading && notifications.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-gray-500">Loading notifications...</div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
                      alt="empty"
                      className="w-24 opacity-50 mb-4"
                    />
                    <p className="text-gray-600">No notifications found</p>
                    <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
                  </div>
                ) : (
                  <ul className="divide-y">
                    {notifications.map((n) => (
                      <li
                        key={n.notification_id}
                        className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
                        style={{borderBottom: '1px solid black'}}
                      >
                        <div className="font-semibold text-sm text-gray-800">{n.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{n.message}</div>
                        <div className="mt-2 text-[11px] text-gray-500">
                          <span className="font-semibold">To:</span>{" "}
                          <span className="text-gray-700">{n.recipient_name}</span> •{" "}
                          <span className="uppercase">{n.recipient_type}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1">
                          {formatDateTime(n.created_at)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {hasMore && notifications.length > 0 && (
                <div className="border-t">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full p-3 text-blue-600 text-sm hover:bg-gray-100 transition disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
