import React from "react";

function StudentGPAChart({ gpaData, loading, error }) {
    if (loading) return <div className="text-center p-4">Đang tải biểu đồ GPA...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Biểu Đồ GPA Theo Học Kỳ</h2>
            <div className="bg-white p-4 rounded-lg shadow" style={{ height: "400px", width: "100%" }}>
                <pre>
                    <code className="chartjs" type="bar">
                        {JSON.stringify({
                            data: {
                                labels: gpaData.map((item) => `${item.semesterOrder} - ${item.semesterYear}`),
                                datasets: [
                                    {
                                        label: "GPA",
                                        data: gpaData.map((item) => item.gpa),
                                        backgroundColor: "#4CAF50",
                                        borderColor: "#fff",
                                        borderWidth: 1,
                                    },
                                ],
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 10,
                                        title: {
                                            display: true,
                                            text: "GPA",
                                        },
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: "Học Kỳ - Năm Học",
                                        },
                                    },
                                },
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                            },
                        })}
                    </code>
                </pre>
            </div>
        </div>
    );
}

export default StudentGPAChart;