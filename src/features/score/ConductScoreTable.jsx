import React, { useEffect, useState } from 'react';

function ConductScoreTable() {
    const [conductScores, setConductScores] = useState([]);
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

            const mockConductScores = [
                { MaSV: 'N22DCVT093', IdHK: 1, ConductScore: 85, Rank: 'Tốt' },
                { MaSV: 'N22DCVT093', IdHK: 2, ConductScore: 90, Rank: 'Xuất sắc' },
                { MaSV: 'N22DCVT093', IdHK: 3, ConductScore: 78, Rank: 'Khá' },
                { MaSV: 'N22DCVT093', IdHK: 4, ConductScore: 82, Rank: 'Tốt' },
            ];
            setConductScores(mockConductScores);

            setSelectedSemester(mockSemesters[0]?.IdHK.toString());
        }
    }, []);

    const filteredConductScores = conductScores.filter(
        (score) => score.IdHK.toString() === selectedSemester
    );

    return (
        <div className="bg-white p-4 shadow-md">
            <div className="mb-4">
                <h3 className="text-lg font-bold">Điểm rèn luyện</h3>
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
                        <th className="border p-2">Điểm rèn luyện</th>
                        <th className="border p-2">Xếp loại</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredConductScores.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="border p-2 text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        filteredConductScores.map((score) => {
                            const semester = semesters.find(
                                (sem) => sem.IdHK === score.IdHK
                            );
                            return (
                                <tr key={`${score.MaSV}-${score.IdHK}`}>
                                    <td className="border p-2">{semester?.Thu}</td>
                                    <td className="border p-2">{semester?.NamHoc}</td>
                                    <td className="border p-2">{score.ConductScore}</td>
                                    <td className="border p-2">{score.Rank}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ConductScoreTable;