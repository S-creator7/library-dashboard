import React, { useState } from "react";
import ConstantSelectors from "../components/ConstantSelectors";
import StudentProfile from "../components/StudentProfile";
import StudentHistory from "../components/StudentHistory";

const Members = () => {
  const [filters, setFilters] = useState({
    session_id: "",
    class_id: "",
    section_id: "",
    classroom_id: "",
    student_id: "",
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Members</h1>
      </div>

      {/* Student Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Select Student</h2>
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
      {filters.student_id && (
        <div className="flex flex-col gap-6 mt-6">
          <StudentProfile studentId={filters.student_id} />
          <StudentHistory studentId={filters.student_id} />
        </div>
      )}
    </div>
  );
};

export default Members;
