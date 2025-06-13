import React, { useEffect, useState } from 'react';

function ScoreTable() {
    const [scores, setScores] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            const mockSemesters = [
                { IdHK: 1, Thu: 1, NamHoc: '2022-2023' },
                { IdHK: 2, Thu: 2, NamHoc: '2022-2023' },
                { IdHK: 3, Thu: 1, NamHoc: '2023-2024' },
                { IdHK: 4, Thu: 2, NamHoc: '2023-2024' },
                { IdHK: 5, Thu: 1, NamHoc: '2024-2025' },
                { IdHK: 6, Thu: 2, NamHoc: '2024-2025' },
            ];
            setSemesters(mockSemesters);

            const mockScores = [
                { MaSV: 'N22DCVT093', IdHK: 1, GPA: 2.8 },
                { MaSV: 'N22DCVT093', IdHK: 2, GPA: 3.0 },
                { MaSV: 'N22DCVT093', IdHK: 3, GPA: 3.2 },
                { MaSV: 'N22DCVT093', IdHK: 4, GPA: 2.7 },
            ];
            setScores(mockScores);

            setSelectedSemester(mockSemesters[0]?.IdHK.toString());
        }
    }, []);

    const filteredScores = scores.filter(
        (score) => score.IdHK.toString() === selectedSemester
    );

    return (
        <div className="bg-white p-4 shadow-md">
            <div className="mb-4">
                <h3 className="text-lg font-bold">Kết quả học tập</h3>
                <select
                    className="mt-2 p-2 border rounded"
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                >
                    {semesters.map((semester) => (
                        <option key={semester.IdHK} value={semester.IdHK}>
                            Học kỳ {semester.Thu} Năm học {semester.NamHoc}
                        </option>
                    ))}
                </select>
            </div>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Học kỳ</th>
                        <th className="border p-2">Năm học</th>
                        <th className="border p-2">GPA</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredScores.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="border p-2 text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        filteredScores.map((score) => {
                            const semester = semesters.find(
                                (sem) => sem.IdHK === score.IdHK
                            );
                            return (
                                <tr key={`${score.MaSV}-${score.IdHK}`}>
                                    <td className="border p-2">{semester?.Thu}</td>
                                    <td className="border p-2">{semester?.NamHoc}</td>
                                    <td className="border p-2">{score.GPA}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ScoreTable;