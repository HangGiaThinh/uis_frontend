import React from "react";

function StudentAcademicResultsTable({ academicResults, loading, error }) {
    if (loading) return <div className="text-center p-4">Đang tải kết quả học tập...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4 t">
            <h2 className="text-2xl font-bold mb-4">Kết Quả Học Tập</h2>
            {academicResults.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-[#00AEEF] text-white">
                            <th className="py-2 px-4 border-b">Học Kỳ</th>
                            <th className="py-2 px-4 border-b">Năm Học</th>
                            <th className="py-2 px-4 border-b">GPA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {academicResults.map((result, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-center">{result.semesterOrder}</td>
                                <td className="py-2 px-4 border-b text-center">{result.semesterYear}</td>
                                <td className="py-2 px-4 border-b text-center">{result.gpa}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center">Không có dữ liệu kết quả học tập.</p>
            )}
        </div>
    );
}

export default StudentAcademicResultsTable;