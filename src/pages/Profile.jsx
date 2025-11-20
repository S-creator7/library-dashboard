import React, { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
    if (!profile) return <p>No profile data found.</p>;

    const coverImage = profile?.user_assets?.cover?.[0];
    const profileImage = profile?.user_assets?.profile?.[0];

    return (
        <div className="max-w-5xl mx-auto p-4">

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
                    <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
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
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg absolute -bottom-12 left-6 bg-gray-300 flex items-center justify-center text-gray-600">
                        No Image
                    </div>
                )}
            </div>

            {/* ------ BASIC INFO ------ */}
            <div className="mt-16 px-2">
                <h2 className="text-2xl font-bold">
                    {profile.first_name} {profile.last_name}
                </h2>
                <p className="text-gray-600">{profile.role_name}</p>
            </div>

            {/* ------ USER INFO GRID ------ */}
            <div className="mt-6 grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone_number}</p>
                <p><strong>Gender:</strong> {profile.gender}</p>
                <p><strong>DOB:</strong> {profile.dob}</p>
                <p><strong>Department:</strong> {profile.department}</p>
                <p><strong>Designation:</strong> {profile.designation}</p>

                <p className="md:col-span-2"><strong>Address:</strong> {profile.address}</p>

                <p className="md:col-span-2">
                    <strong>Account Created At:</strong> {formatDateTime(profile.created_at)}
                </p>
            </div>

            {/* ------ USER ASSETS ------ */}
            <div className="mt-8 bg-white shadow-md rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">User Assets</h3>

                <div>
                    <strong className="block mb-2">Documents:</strong>

                    {profile?.user_assets?.documents?.length > 0 ? (
                        <ul className="list-disc ml-6">
                            {profile.user_assets.documents.map((url, i) => (
                                <li key={i}>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Document {i + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No documents available</p>
                    )}
                </div>
            </div>

            {/* ------ QUALIFICATIONS ------ */}
            <div className="mt-8 bg-white shadow-md rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Qualifications</h3>

                {profile?.qualificationsDetail?.length > 0 ? (
                    profile.qualificationsDetail.map((q, i) => (
                        <div
                            key={i}
                            className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50"
                        >
                            <p><strong>Qualification:</strong> {q.qualification}</p>
                            <p><strong>Institute:</strong> {q.institute}</p>
                            <p><strong>Year of Passing:</strong> {q.year_of_passing}</p>
                        </div>
                    ))
                ) : (
                    <p>No qualifications available.</p>
                )}
            </div>

            {/* ------ SCHOOL DETAILS (NO IDs) ------ */}
            <div className="mt-8 bg-white shadow-md rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">School Details</h3>

                <div className="grid md:grid-cols-2 gap-3">
                    {Object.entries(profile.schoolDetail)
                        .filter(([key]) => !key.toLowerCase().includes("id")) // remove any ID field
                        .map(([key, value]) => (
                            <p
                                key={key}
                                className={key === "address" || key === "website" ? "md:col-span-2" : ""}
                            >
                                <strong className="capitalize">{key.replace(/_/g, " ")}:</strong>{" "}
                                {value || "N/A"}
                            </p>
                        ))}
                </div>
            </div>

            {/* ------ ATTENDANCE ------ */}
            <div className="mt-8 bg-white shadow-md rounded-xl p-6 mb-10">
                <h3 className="text-xl font-semibold mb-4">Today's Attendance</h3>

                <p><strong>Marked:</strong> {profile.today_attendance.is_attendance_marked ? "Yes" : "No"}</p>
                <p><strong>Status:</strong> {profile.today_attendance.status || "N/A"}</p>
                <p><strong>In Time:</strong> {profile.today_attendance.in_time || "—"}</p>
                <p><strong>Out Time:</strong> {profile.today_attendance.out_time || "—"}</p>
            </div>

        </div>
    );
};

export default Profile;
