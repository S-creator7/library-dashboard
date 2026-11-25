import React, { useEffect, useState, useRef } from "react";
import { FaBell, FaTimes, FaFilter, FaSpinner } from "react-icons/fa";
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
        className="relative text-white hover:text-[#f86730] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#f86730]/50 rounded-full p-1"
      >
        <FaBell className="text-xl" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          <div
            className={`absolute top-0 right-0 h-screen w-[420px] bg-white shadow-2xl shadow-black/20 transform transition-transform duration-300 ease-in-out ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaBell className="text-[#f86730]" />
                  <span className="font-semibold text-[#0F172A] text-lg">Notifications</span>
                  {notifications.length > 0 && (
                    <span className="bg-[#f86730]/10 text-[#f86730] text-xs font-medium px-2 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors hover:bg-white rounded-lg w-8 h-8 flex items-center justify-center"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              {/* Filters */}
              <div className="px-4 py-3 border-b border-[#E2E8F0] space-y-3 bg-white">
                <div className="flex flex-wrap gap-2 w-full">
                  {notificationTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setNotificationType(type)}
                      className={`flex-1 min-w-fit px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-all duration-200 ${
                        notificationType === type
                          ? "bg-[#f86730] text-white border-[#f86730] shadow-sm"
                          : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#f86730]/40 hover:text-[#0F172A]"
                      }`}
                    >
                      {type === "ALL" ? "All" : type.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center w-1/2 gap-2">
                    <label className="text-xs font-medium text-[#64748B] whitespace-nowrap">From:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate || today}
                      className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] text-[#0F172A]"
                    />
                  </div>

                  <div className="flex items-center w-1/2 gap-2">
                    <label className="text-xs font-medium text-[#64748B] whitespace-nowrap">To:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      max={today}
                      min={startDate}
                      className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#f86730]/40 focus:border-[#f86730] text-[#0F172A]"
                    />
                  </div>
                </div>

                {(startDate || endDate) && (
                  <button
                    className="text-[#f86730] text-xs font-medium hover:underline"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {loading && notifications.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <FaSpinner className="animate-spin text-[#f86730] mr-2" />
                    <span className="text-[#64748B]">Loading notifications...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center mb-4">
                      <FaBell className="text-3xl text-[#94A3B8]" />
                    </div>
                    <p className="text-[#0F172A] font-medium">No notifications</p>
                    <p className="text-sm text-[#64748B] mt-1">Try changing your filters</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-[#E2E8F0]">
                    {notifications.map((n) => (
                      <li
                        key={n.notification_id}
                        className="px-4 py-3 hover:bg-[#F8FAFC] transition-colors duration-150 cursor-pointer"
                      >
                        <div className="font-semibold text-sm text-[#0F172A]">{n.title}</div>
                        <div className="text-xs text-[#64748B] mt-1 leading-relaxed">{n.message}</div>
                        <div className="mt-2 text-[11px] text-[#64748B] flex items-center gap-1">
                          <span className="font-medium">To:</span>
                          <span className="text-[#0F172A]">{n.recipient_name}</span>
                          <span className="text-[#94A3B8]">•</span>
                          <span className="uppercase text-[#64748B]">{n.recipient_type}</span>
                        </div>
                        <div className="text-[10px] text-[#94A3B8] mt-1">
                          {formatDateTime(n.created_at)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Load More */}
              {hasMore && notifications.length > 0 && (
                <div className="border-t border-[#E2E8F0]">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full p-3 text-[#f86730] text-sm font-medium hover:bg-[#F8FAFC] transition-colors duration-150 disabled:text-[#94A3B8] disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Load More"
                    )}
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