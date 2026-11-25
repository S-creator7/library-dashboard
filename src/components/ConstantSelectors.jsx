import React, { useEffect, useState } from "react";
import { getSessions, getClassrooms, getStudents } from "../services/constantsService";
import Pagination from "./Pagination";

const ConstantSelectors = ({
    showSession = true,
    showClassroom = true,
    showSection = true,
    showStudent = true,
    onChange,
    values = { session_id: "", class_id: "", section_id: "", classroom_id: "", student_id: "" },
}) => {
    const [sessions, setSessions] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [loading, setLoading] = useState({
        session: false,
        classroom: false,
        student: false,
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    /** 🧭 Fetch Sessions */
    useEffect(() => {
        if (showSession) {
            setLoading((l) => ({ ...l, session: true }));
            getSessions()
                .then(setSessions)
                .finally(() => setLoading((l) => ({ ...l, session: false })));
        }
    }, [showSession]);

    /** 🏫 Fetch Classrooms when session changes */
    useEffect(() => {
        if (values.session_id && showClassroom) {
            setLoading((l) => ({ ...l, classroom: true }));
            getClassrooms(values.session_id)
                .then((res) => {
                    setClassrooms(res);
                    setSections([]);
                })
                .finally(() => setLoading((l) => ({ ...l, classroom: false })));
        } else {
            setClassrooms([]);
            setSections([]);
        }
    }, [values.session_id, showClassroom]);

    /** 🧩 Update sections when class changes */
    useEffect(() => {
        if (values.class_id && classrooms.length > 0) {
            const selectedClass = classrooms.find((c) => c.class_id == values.class_id);
            if (selectedClass) setSections(selectedClass.sections || []);
        } else {
            setSections([]);
        }
    }, [values.class_id, classrooms]);

    /** 👩‍🎓 Fetch Students when classroom changes / pagination / search */
    useEffect(() => {
        if (values.classroom_id && showStudent) {
            setLoading((l) => ({ ...l, student: true }));
            getStudents({
                classroom_id: values.classroom_id,
                page: page,
                limit: limit,
                search: debouncedSearch,
            })
                .then((res) => {
                    setStudents(res.data);
                    if (res.pagination) setTotalPages(res?.pagination?.total_pages || 1);
                    ;
                })
                .finally(() => setLoading((l) => ({ ...l, student: false })));
        } else {
            setStudents([]);
        }
    }, [values.classroom_id, page, limit, debouncedSearch, showStudent]);

    /** 💡 Common change handler */
    const handleChange = (field, value) => {
        const updated = { ...values, [field]: value };

        if (field === "session_id") {
            updated.class_id = "";
            updated.section_id = "";
            updated.classroom_id = "";
            updated.student_id = "";
        } else if (field === "class_id") {
            updated.section_id = "";
            updated.classroom_id = "";
            updated.student_id = "";
        } else if (field === "section_id") {
            const selectedSection = sections.find((s) => s.section_id == value);
            updated.classroom_id = selectedSection ? selectedSection.classroom_id : "";
            updated.student_id = "";
        } else if (field === "student_id") {
            updated.student_id = value;
        }

        onChange?.(updated);
    };

    return (
        <div className="space-y-6">
            {/* Top selectors (Session, Class, Section) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {showSession && (
                    <select
                        value={values.session_id}
                        onChange={(e) => handleChange("session_id", e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    >
                        <option value="">Select Session</option>
                        {loading.session ? (
                            <option>Loading...</option>
                        ) : (
                            sessions.map((s) => (
                                <option key={s.session_id} value={s.session_id}>
                                    {s.session_name}
                                </option>
                            ))
                        )}
                    </select>
                )}

                {showClassroom && (
                    <select
                        value={values.class_id}
                        onChange={(e) => handleChange("class_id", e.target.value)}
                        disabled={!values.session_id}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                    >
                        <option value="">Select Class</option>
                        {loading.classroom ? (
                            <option>Loading...</option>
                        ) : (
                            classrooms.map((cls) => (
                                <option key={cls.class_id} value={cls.class_id}>
                                    {cls.class_name}
                                </option>
                            ))
                        )}
                    </select>
                )}

                {showSection && (
                    <select
                        value={values.section_id}
                        onChange={(e) => handleChange("section_id", e.target.value)}
                        disabled={!values.class_id}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                    >
                        <option value="">Select Section</option>
                        {sections.map((sec) => (
                            <option key={sec.section_id} value={sec.section_id}>
                                {sec.section_name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Student List Section */}
            {showStudent && (
                <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                    {/* Search bar */}
                    <div className="flex items-center justify-between mb-3">
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                    </div>

                    {/* Student list */}
                    <div className="border rounded-md">
                        {loading.student ? (
                            <p className="text-gray-500 p-3 text-sm">Loading students...</p>
                        ) : students.length === 0 ? (
                            <p className="text-gray-500 p-3 text-sm">No students found.</p>
                        ) : (
                            <ul>
                                {students.map((st) => (
                                    <li
                                        key={st.student_id}
                                        onClick={() => handleChange("student_id", st.student_id)}
                                        className={`px-4 py-2 border-b cursor-pointer ${values.student_id == st.student_id
                                            ? "bg-gray-900 text-white"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-sm">{`${st.first_name} ${st.middle_name} ${st.last_name}`}</span>
                                            <span className="text-xs text-gray-500">
                                                Roll: {st.roll_number || "-"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">{st.admission_number}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Pagination */}

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        limit={limit}
                        onPageChange={(newPage) => setPage(newPage)}
                        onLimitChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                    />

                </div>
            )}
        </div>
    );
};

export default ConstantSelectors;
