import React, { useEffect, useState } from "react";
import { changePassword, getProfile } from "../services/authService";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);

        return (
            date.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }) +
            " • " +
            date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    };

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
        } catch (err) {
            console.log("Profile fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage("");
        setPasswordError("");

        if (newPassword !== confirmNewPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await changePassword(currentPassword, newPassword);
            if (res.status) {
                setPasswordMessage(res.message || "Password changed successfully.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
            } else {
                setPasswordError(res.message || "Unable to change password.");
            }
        } catch (err) {
            setPasswordError(err.message || "Failed to change password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) return <p className="text-center mt-10 text-[#64748B]">Loading...</p>;
    if (!profile) return <p className="text-center mt-10 text-[#64748B]">No profile data found.</p>;

    const coverImage = profile?.user_assets?.cover?.[0];
    const profileImage = profile?.user_assets?.profile?.[0];

    return (
        <div className="max-w-5xl mx-auto p-4 bg-[#F8FAFC] min-h-screen">

            {/* ------ COVER + PROFILE IMAGE ------ */}
            <div className="relative w-full">

                {/* Cover */}
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt="cover"
                        className="w-full h-48 object-cover rounded-xl shadow"
                    />
                ) : (
                    <div className="w-full h-48 bg-[#F8FAFC] rounded-xl flex items-center justify-center text-[#94A3B8] border border-[#E2E8F0]">
                        No Cover Image
                    </div>
                )}

                {/* Profile */}
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt="profile"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg absolute -bottom-12 left-6 object-cover"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg absolute -bottom-12 left-6 bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] border border-[#E2E8F0]">
                        No Image
                    </div>
                )}
            </div>

            {/* ------ BASIC INFO ------ */}
            <div className="mt-16 px-2">
                <h2 className="text-2xl font-bold text-[#0F172A]">
                    {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-[#f86730] font-medium">{profile.role_name}</p>
            </div>

            {/* ------ USER INFO GRID ------ */}
            <div className="mt-6 grid md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0]">
                <p className="text-[#0F172A]"><strong>Email:</strong> {profile.email}</p>
                <p className="text-[#0F172A]"><strong>Phone:</strong> {profile.phone_number}</p>
                <p className="text-[#0F172A]"><strong>Gender:</strong> {profile.gender}</p>
                <p className="text-[#0F172A]"><strong>DOB:</strong> {profile.dob || "N/A"}</p>
                <p className="text-[#0F172A]"><strong>Department:</strong> {profile.department}</p>
                <p className="text-[#0F172A]"><strong>Designation:</strong> {profile.designation}</p>

                <p className="md:col-span-2 text-[#0F172A]"><strong>Address:</strong> {profile.address}</p>

                <p className="md:col-span-2 text-[#0F172A]">
                    <strong>Account Created At:</strong> {formatDateTime(profile.created_at)}
                </p>
            </div>

            {/* ------ USER ASSETS ------ */}
            <div className="mt-4 bg-white shadow-md rounded-xl p-6 border border-[#E2E8F0]">
                <h3 className="text-xl font-semibold mb-4 text-[#0F172A]">User Assets</h3>

                <div>
                    <strong className="block mb-2 text-[#0F172A]">Documents:</strong>

                    {profile?.user_assets?.documents?.length > 0 ? (
                        <ul className="list-disc ml-6">
                            {profile.user_assets.documents.map((url, i) => (
                                <li key={i}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#f86730] hover:underline"
                                    >
                                        Document {i + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#64748B]">No documents available</p>
                    )}
                </div>
            </div>

            {/* ------ QUALIFICATIONS ------ */}
            <div className="mt-8 bg-white shadow-md rounded-xl p-6 border border-[#E2E8F0]">
                <h3 className="text-xl font-semibold mb-4 text-[#0F172A]">Qualifications</h3>

                {profile?.qualificationsDetail?.length > 0 ? (
                    profile.qualificationsDetail.map((q, i) => (
                        <div
                            key={i}
                            className="border border-[#E2E8F0] rounded-lg p-4 mb-3 bg-[#F8FAFC]"
                        >
                            <p className="text-[#0F172A]"><strong>Qualification:</strong> {q.qualification}</p>
                            <p className="text-[#0F172A]"><strong>Institute:</strong> {q.institute}</p>
                            <p className="text-[#0F172A]"><strong>Year of Passing:</strong> {q.year_of_passing}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-[#64748B]">No qualifications available.</p>
                )}
            </div>

            {/* ------ SCHOOL DETAILS (NO IDs) ------ */}
            <div className="mt-8 bg-white shadow-md rounded-xl p-6 border border-[#E2E8F0]">
                <h3 className="text-xl font-semibold mb-4 text-[#0F172A]">School Details</h3>

                <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(profile.schoolDetail)
                        .filter(([key]) => !key.toLowerCase().includes("id"))
                        .map(([key, value]) => (
                            <p
                                key={key}
                                className={key === "address" || key === "website" ? "md:col-span-2 text-[#0F172A]" : "text-[#0F172A]"}
                            >
                                <strong className="capitalize">{key.replace(/_/g, " ")}:</strong>{" "}
                                {value || "N/A"}
                            </p>
                        ))}
                </div>
            </div>

            {/* ------ ATTENDANCE ------ */}
            <div className="mt-8 bg-white shadow-md rounded-xl p-6 border border-[#E2E8F0]">
                <h3 className="text-xl font-semibold mb-4 text-[#0F172A]">Today's Attendance</h3>

                <p className="text-[#0F172A]"><strong>Marked:</strong> {profile.today_attendance.is_attendance_marked ? "Yes" : "No"}</p>
                <p className="text-[#0F172A]"><strong>Status:</strong> {profile.today_attendance.status || "N/A"}</p>
                <p className="text-[#0F172A]"><strong>In Time:</strong> {profile.today_attendance.in_time || "—"}</p>
                <p className="text-[#0F172A]"><strong>Out Time:</strong> {profile.today_attendance.out_time || "—"}</p>
            </div>

            <div className="mt-8 bg-white shadow-md rounded-xl p-6 mb-10 border border-[#E2E8F0]">
                <h3 className="text-xl font-semibold mb-4 text-[#0F172A]">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-xl">
                    <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f86730] focus:border-[#f86730]"
                    />
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f86730] focus:border-[#f86730]"
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f86730] focus:border-[#f86730]"
                    />
                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="bg-[#f86730] text-white px-6 py-3 rounded-lg hover:bg-[#e35d1f] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {passwordLoading ? "Updating..." : "Update Password"}
                    </button>
                    {passwordMessage && (
                        <p className="text-[#22C55E] text-sm">{passwordMessage}</p>
                    )}
                    {passwordError && (
                        <p className="text-[#EF4444] text-sm">{passwordError}</p>
                    )}
                </form>
            </div>

        </div>
    );
};

export default Profile;