import React, { useState } from "react";
import ConstantSelectors from "../components/ConstantSelectors";
import StudentProfile from "../components/StudentProfile";
import StudentHistory from "../components/StudentHistory";
import { FaUsers, FaUser, FaBook, FaHistory } from "react-icons/fa";

const Members = () => {
  const [filters, setFilters] = useState({
    session_id: "",
    class_id: "",
    section_id: "",
    classroom_id: "",
    student_id: "",
  });

  return (
    <div className="p-4 sm:p-6 bg-[#F8FAFC] min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <FaUsers className="text-[#f86730]" />
            Members
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            View and manage library members
          </p>
        </div>

        <div className="w-full max-w-full p-5 space-y-6 overflow-x-hidden">
          {/* Student Selection */}
          <div>
            <h2 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2 mb-3">
              <FaUser className="text-[#f86730]" />
              Select Student
            </h2>
            <ConstantSelectors
              showSession
              showClassroom
              showSection
              showStudent
              values={filters}
              onChange={setFilters}
            />
          </div>

          {/* Student Profile + History */}
          {filters.student_id ? (
            <div className="space-y-6 pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                Student selected: <span className="font-medium text-[#0F172A]">ID #{filters.student_id}</span>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaUser className="text-[#f86730] text-sm" />
                    <h3 className="text-sm font-semibold text-[#0F172A]">Profile Details</h3>
                  </div>
                  <StudentProfile studentId={filters.student_id} />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaHistory className="text-[#f86730] text-sm" />
                    <h3 className="text-sm font-semibold text-[#0F172A]">Transaction History</h3>
                  </div>
                  <StudentHistory studentId={filters.student_id} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-[#E2E8F0] rounded-2xl bg-[#F8FAFC]">
              <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-3xl text-[#94A3B8]" />
              </div>
              <p className="text-base font-medium text-[#0F172A]">Select a student to view details</p>
              <p className="text-sm text-[#64748B] mt-1">
                Choose a student from the dropdown above
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;