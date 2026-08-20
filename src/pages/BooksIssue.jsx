import React, { useState } from "react";
import IssuedBooks from "../components/IssuedBooks";
import { useNavigate } from "react-router-dom";
import { FaBook, FaPlus, FaHistory } from "react-icons/fa";

const BooksIssue = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
              <FaBook className="text-[#f86730]" />
              Books
            </h1>
            <p className="text-sm text-[#64748B] mt-0.5">
              Manage issued books and transactions
            </p>
          </div>
          <button
            onClick={() => navigate("/issue-Book")}
            className="px-4 py-2 bg-[#f86730] text-white text-sm font-medium rounded-xl hover:bg-[#e35d1f] active:scale-95 transition-all duration-150 shadow-sm flex items-center gap-2"
          >
            <FaPlus className="text-xs" />
            Issue Book
          </button>
        </div>

        {/* Issued Books List */}
        <div className="p-4">
          <IssuedBooks />
        </div>
      </div>
    </div>
  );
};

export default BooksIssue;