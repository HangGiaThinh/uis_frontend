// src/features/student/components/academic/StudentAverageGPA.jsx
import React from "react";

function StudentAverageGPA({ gpa, loading, error }) {
    if (loading) return <p className="text-center text-blue-500">Đang tải GPA trung bình...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold mb-2">GPA Trung bình</h2>
            <p className="text-3xl font-bold text-green-600">{gpa.toFixed(2)}</p>
        </div>
    );
}

export default StudentAverageGPA;
