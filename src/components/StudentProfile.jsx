import React, { useEffect, useState } from "react";
import { getStudentProfile } from "../services/memberService";

const StudentProfile = ({ studentId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    setLoading(true);
    setError(null);
    getStudentProfile(studentId)
      .then(setProfile)
      .catch((err) => setError(err.message || "Failed to load student profile"))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (!studentId) {
    return <p className="text-gray-500 text-sm mt-4">Select a student to view their profile.</p>;
  }

  if (loading) {
    return <p className="text-gray-500 text-sm mt-4">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm mt-4">{error}</p>;
  }

  if (!profile) {
    return <p className="text-gray-500 text-sm mt-4">No profile data found.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-gray-800">Student Profile</h2>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            profile.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {profile.status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Student Name</p>
          <p className="font-medium text-gray-900">{profile.student_name}</p>
        </div>

        <div>
          <p className="text-gray-500">Class</p>
          <p className="font-medium text-gray-900">{profile.class_name}</p>
        </div>

        <div>
          <p className="text-gray-500">Section</p>
          <p className="font-medium text-gray-900">{profile.section_name}</p>
        </div>

        <div>
          <p className="text-gray-500">Roll Number</p>
          <p className="font-medium text-gray-900">{profile.roll_number || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Books Issued</p>
          <p className="font-medium text-gray-900">{profile.total_books_issued}</p>
        </div>

        <div>
          <p className="text-gray-500">Fines Due</p>
          <p className="font-medium text-red-600">₹{profile.total_fines_due || 0}</p>
        </div>

        <div>
          <p className="text-gray-500">Fines Paid</p>
          <p className="font-medium text-green-600">₹{profile.total_fines_paid || 0}</p>
        </div>

        <div>
          <p className="text-gray-500">Profile ID</p>
          <p className="font-medium text-gray-900">{profile.profile_id}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Last updated: {new Date(profile.updated_at).toLocaleString()}
      </p>
    </div>
  );
};

export default StudentProfile;
