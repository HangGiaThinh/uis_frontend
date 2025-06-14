import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getTrainingScoreDetail, submitTrainingScore } from "../../services/score/scoreService";
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

function ScoreDetailPage() {
    const { id } = useParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ['trainingScoreDetail', id],
        queryFn: () => getTrainingScoreDetail(id),
    });

    const { register, handleSubmit, setValue, getValues, formState: { errors }, trigger, setError } = useForm({
        defaultValues: {},
    });

    const mutation = useMutation({
        mutationFn: (formData) => {
            const payload = {
                training_score_id: parseInt(id),
                training_score_details: allItems
                    .filter(item => !item.isParent && item.id)
                    .map(item => ({
                        evaluation_content_id: item.id,
                        score: parseInt(getValues(`score_${item.parentId}_${item.id}`) || 0)
                    }))
            };
            return submitTrainingScore(id, payload);
        },
        onSuccess: () => {
            alert('Chấm điểm thành công!');
            queryClient.refetchQueries(['trainingScoreDetail', id]);
        },
        onError: (error) => alert('Lỗi khi chấm điểm: ' + error.message),
    });

    const [selectedScores, setSelectedScores] = useState({});
    const [totalScore, setTotalScore] = useState(0);
    const [isClassLeader, setIsClassLeader] = useState(false); // Mặc định là sinh viên thường

    useEffect(() => {
        if (data && data.data.criterions) {
            let initialTotal = 0;
            const newSelectedScores = { ...selectedScores };

            // Khởi tạo điểm cho tất cả mục con và cha
            data.data.criterions.forEach(criterion => {
                criterion.evaluation_contents.forEach(content => {
                    if (content.evaluation_content_details) {
                        content.evaluation_content_details.forEach(detail => {
                            const score = detail.student_score || detail.total_student_score || 0;
                            setValue(`score_${criterion.id}_${detail.id}`, score);
                            newSelectedScores[detail.id] = score;
                            initialTotal += score;
                        });
                    } else {
                        const score = content.student_score || content.total_student_score || 0;
                        setValue(`score_${criterion.id}_${content.id}`, score);
                        newSelectedScores[content.id] = score;
                        initialTotal += score;
                    }
                });
            });

            // Xử lý điểm mặc định cho các mục cha
            const score12 = data.data.criterions.find(c => c.id === 1)?.evaluation_contents.find(c => c.id === 2);
            if (score12 && score12.evaluation_content_details) {
                const maxChildScore = Math.max(...[3, 4, 5, 6, 7, 8].map(id => newSelectedScores[id] || 0));
                const parentScore = maxChildScore > 0 ? Math.min(maxChildScore, score12.max_score || 10) : 0;
                newSelectedScores[2] = parentScore;
                setValue(`score_1_2`, parentScore);
                initialTotal += parentScore;
            }

            const score13 = data.data.criterions.find(c => c.id === 1)?.evaluation_contents.find(c => c.id === 9);
            if (score13 && score13.evaluation_content_details) {
                const childSum = [10, 11, 12, 13, 14, 15].reduce((sum, id) => sum + (newSelectedScores[id] || 0), 0);
                const parentScore = childSum !== 0 ? Math.min(4 + childSum, score13.max_score || 10) : 4;
                newSelectedScores[9] = parentScore;
                setValue(`score_1_9`, parentScore);
                initialTotal += parentScore;
            }

            const score21 = data.data.criterions.find(c => c.id === 2)?.evaluation_contents.find(c => c.id === 16);
            if (score21 && score21.evaluation_content_details) {
                const maxScore = score21.max_score || 0;
                const penalty = [17, 18, 19, 20, 21, 22].reduce((sum, id) => sum + (newSelectedScores[id] || 0), 0);
                // Đảm bảo điểm không âm và không vượt quá maxScore
                const parentScore = Math.min(maxScore, Math.max(0, maxScore + penalty));
                newSelectedScores[16] = parentScore;
                setValue(`score_2_16`, parentScore);
                initialTotal += parentScore;
            }

            const score22 = data.data.criterions.find(c => c.id === 2)?.evaluation_contents.find(c => c.id === 19);
            if (score22 && score22.evaluation_content_details) {
                const maxScore = score22.max_score || 0;
                const penalty = score22.evaluation_content_details.reduce((sum, detail) => sum + (detail.student_score || 0), 0);
                const parentScore = Math.max(0, maxScore + penalty);
                newSelectedScores[19] = parentScore;
                setValue(`score_2_19`, parentScore);
                initialTotal += parentScore;
            }

            const score23 = data.data.criterions.find(c => c.id === 2)?.evaluation_contents.find(c => c.id === 21);
            if (score23) {
                const maxScore = score23.max_score || 0;
                const adjustment = score23.evaluation_content_details[0]?.student_score || parseInt(getValues(`score_${2}_${score23.evaluation_content_details[0]?.id}`) || 0);
                const parentScore = Math.max(0, Math.min(maxScore, maxScore + adjustment));
                newSelectedScores[21] = parentScore;
                setValue(`score_2_21`, parentScore);
                initialTotal += parentScore;
            }

            setSelectedScores(newSelectedScores);
            setTotalScore(initialTotal);
        }
    }, [data, setValue]);

    const handleCheckboxChange = (e, score, contentId, parentId) => {
        const newSelectedScores = { ...selectedScores };
        const isChecked = e.target.checked;

        // Cập nhật điểm cho mục con
        if (parentId === 2) { // 1.2
            // Reset tất cả điểm của các mục con về 0
            [3, 4, 5, 6, 7, 8].forEach(id => {
                newSelectedScores[id] = 0;
                setValue(`score_${parentId}_${id}`, 0);
            });

            // Nếu checkbox được chọn, cập nhật điểm cho mục con đó
            if (isChecked) {
                newSelectedScores[contentId] = score;
                setValue(`score_${parentId}_${contentId}`, score);
            }

            // Tính điểm cho mục cha
            const parentContent = allItems.find(item => item.id === parentId);
            const maxScore = parentContent?.max_score || 10;
            const parentScore = Math.min(maxScore, Math.max(...[3, 4, 5, 6, 7, 8].map(id => newSelectedScores[id] || 0)));
            newSelectedScores[2] = parentScore;
            setValue(`score_1_2`, parentScore);
        } else if (parentId === 16) { // 2.1
            // Reset tất cả điểm của các mục con về 0
            [17, 18, 19, 20, 21, 22].forEach(id => {
                newSelectedScores[id] = 0;
                setValue(`score_${parentId}_${id}`, 0);
            });

            // Nếu checkbox được chọn, cập nhật điểm cho mục con đó
            if (isChecked) {
                newSelectedScores[contentId] = score;
                setValue(`score_${parentId}_${contentId}`, score);
            }

            // Tính điểm cho mục cha
            const parentContent = allItems.find(item => item.id === parentId);
            const maxScore = parentContent?.max_score || 15;
            const penalty = [17, 18, 19, 20, 21, 22].reduce((sum, id) => {
                const isSelected = newSelectedScores[id] !== undefined && newSelectedScores[id] !== 0;
                return sum + (isSelected ? newSelectedScores[id] : 0);
            }, 0);
            const parentScore = Math.min(maxScore, Math.max(0, maxScore + penalty));
            newSelectedScores[16] = parentScore;
            setValue(`score_2_16`, parentScore);
        } else if (parentId === 19) { // 2.2
            const parentContent = allItems.find(item => item.id === parentId);
            const maxScore = parentContent?.max_score || 5;
            const penalty = parseInt(getValues(`score_${parentId}_${contentId}`) || 0);
            const parentScore = Math.max(0, maxScore + penalty);
            newSelectedScores[19] = parentScore;
            setValue(`score_2_19`, parentScore);
        }

        updateTotalScore(newSelectedScores);
        setSelectedScores(newSelectedScores);
        trigger();
    };

    const updateTotalScore = (scores) => {
        let newTotal = 0;
        allItems.forEach(item => {
            if (!item.isParent && item.id) {
                // Bỏ qua việc tính điểm của các mục con trong phần 1.2 (id từ 3-8)
                if (item.parentId === 2 && [3, 4, 5, 6, 7, 8].includes(item.id)) {
                    return;
                }
                const field = `score_${item.parentId}_${item.id}`;
                const score = parseInt(getValues(field) || 0);
                newTotal += score;
            }
        });
        setTotalScore(newTotal);
    };

    const validateForm = () => {
        let isValid = true;
        allItems.forEach(item => {
            if (!item.isParent && item.id) {
                const field = `score_${item.parentId}_${item.id}`;
                const score = getValues(field);
                // Chỉ validate giới hạn số âm/dương
                if ([19, 21, 27, 33].includes(item.id) && score > 0) {
                    setError(field, { type: 'validate', message: 'Chỉ được nhập số âm hoặc 0 cho điểm điều chỉnh' });
                    isValid = false;
                }
                if (![19, 21, 27, 33].includes(item.id) && score < 0) {
                    setError(field, { type: 'validate', message: 'Chỉ được nhập số dương hoặc 0 cho điểm' });
                    isValid = false;
                }
            }
        });
        return isValid;
    };

    const onSubmitWithValidation = async (data) => {
        // Bỏ qua validation khi gửi điểm
        mutation.mutate(data);
    };

    if (isLoading) return <div className="container mx-auto p-4">Đang tải...</div>;
    if (error) return <div className="container mx-auto p-4">Lỗi: {error.message}</div>;
    if (!data?.data?.criterions || data.data.criterions.length === 0) {
        return <div className="container mx-auto p-4">Không có dữ liệu chi tiết để hiển thị.</div>;
    }

    const allItems = data.data.criterions.flatMap((criterion, criterionIndex) => {
        const parentItem = {
            isParent: true,
            criterionName: criterion.criterion_name,
            maxScore: criterion.id === 3 ? 20 : criterion.max_score,
            serial: `${criterionIndex + 1}`,
        };

        const children = criterion.evaluation_contents.flatMap((content, contentIndex) => {
            const parentContentItem = {
                ...content,
                criterionName: criterion.criterion_name,
                isParent: false,
                maxScore: content.max_score,
                parentId: criterion.id,
                serial: `${criterionIndex + 1}.${contentIndex + 1}`,
            };
            if (content.evaluation_content_details) {
                return [
                    parentContentItem,
                    ...content.evaluation_content_details.map((detail, detailIndex) => ({
                        ...detail,
                        parentContent: content.content,
                        criterionName: criterion.criterion_name,
                        isParent: false,
                        maxScore: detail.score,
                        parentId: content.id,
                        serial: null,
                    })),
                ];
            }
            return [parentContentItem];
        });

        return [parentItem, ...children];
    });

    return (
        <div className="container mx-auto p-4">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</h1>
                <h2 className="text-xl">CƠ SỞ TẠI TP. HỒ CHÍ MINH</h2>
                <p className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p>Độc lập - Tự do - Hạnh phúc</p>
                <h1 className="text-2xl font-bold mt-4">PHIẾU ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN</h1>
                <p>Học kỳ: I     Năm học: 2024-2025</p>
                <p>Họ và tên: .....................................     Ngày sinh: .........................</p>
                <p>Mã số sinh viên: .............................     Lớp: .....................................</p>
            </div>
            <form onSubmit={handleSubmit(onSubmitWithValidation)} className="overflow-x-auto">
                <table className="table w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Nội dung đánh giá</th>
                            <th className="border border-gray-300 p-2">Điểm quy định</th>
                            <th className="border border-gray-300 p-2">Điểm đánh giá</th>
                            <th className="border border-gray-300 p-2">Sinh viên đánh giá</th>
                            <th className="border border-gray-300 p-2">Tập thể lớp đánh giá</th>
                            <th className="border border-gray-300 p-2">CVHT đánh giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allItems.map((item, index) => {
                            if (item.isParent) {
                                return (
                                    <tr key={`${item.criterionName}_${index}`} className="bg-gray-200">
                                        <td className="border border-gray-300 p-2" colSpan={6}>
                                            <span className="font-bold"> {item.criterionName}</span>
                                            <br />
                                            <span>Mức điểm tối đa Tiêu chí {item.serial}: {item.maxScore} điểm</span>
                                        </td>
                                    </tr>
                                );
                            } else if (item.evaluation_content_details) {
                                return (
                                    <tr key={`${item.id}_${index}`}>
                                        <td className="border border-gray-300 p-2" colSpan={6}>
                                            <span className="font-semibold">{item.content}</span>
                                            <span className="ml-4 font-medium">
                                                Điểm hiện tại: {selectedScores[item.id] !== undefined ? selectedScores[item.id] : (item.id === 19 ? 5 : (item.id === 2 ? 0 : (item.max_score || 5)))}
                                            </span>
                                            <span className="ml-4 font-medium">
                                                Điểm tối đa: {item.max_score || 0}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={`${item.id || item.criterionName}_${index}`}>
                                        <td className="border border-gray-300 p-2 pl-8">{item.content || 'Chưa có nội dung'}</td>
                                        <td className="border border-gray-300 p-2">{item.maxScore || 0}</td>
                                        <td className="border border-gray-300 p-2">
                                            {[27, 33].includes(item.id) ? (
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedScores[item.id] === -10}
                                                        onChange={(e) => {
                                                            const newScore = e.target.checked ? -10 : 0;
                                                            setValue(`score_${item.parentId}_${item.id}`, newScore);
                                                            const newSelectedScores = { ...selectedScores, [item.id]: newScore };
                                                            setSelectedScores(newSelectedScores);
                                                            updateTotalScore(newSelectedScores);
                                                        }}
                                                        disabled={data.data.status !== 'WAIT_STUDENT'}
                                                    />
                                                </label>
                                            ) : item.id === 21 ? (
                                                <input
                                                    type="number"
                                                    {...register(`score_${item.parentId}_${item.id}`, {
                                                        min: -5,
                                                        max: 0,
                                                        valueAsNumber: true,
                                                    })}
                                                    className="input input-bordered w-full"
                                                    disabled={data.data.status !== 'WAIT_STUDENT'}
                                                    defaultValue={item.student_score || item.total_student_score || 0}
                                                    onChange={(e) => {
                                                        const newScore = parseInt(e.target.value) || 0;
                                                        setValue(`score_${item.parentId}_${item.id}`, newScore);
                                                        const newSelectedScores = { ...selectedScores, [item.id]: newScore };
                                                        setSelectedScores(newSelectedScores);
                                                        updateTotalScore(newSelectedScores);
                                                    }}
                                                />
                                            ) : [19, 21].includes(item.parentId) ? (
                                                <input
                                                    type="number"
                                                    {...register(`score_${item.parentId}_${item.id}`, {
                                                        min: -(item.max_score || 5),
                                                        max: 0,
                                                        valueAsNumber: true,
                                                    })}
                                                    className="input input-bordered w-full"
                                                    disabled={data.data.status !== 'WAIT_STUDENT'}
                                                    defaultValue={item.student_score || item.total_student_score || 0}
                                                    onChange={(e) => {
                                                        const newScore = parseInt(e.target.value) || 0;
                                                        setValue(`score_${item.parentId}_${item.id}`, newScore);
                                                        handleCheckboxChange({ target: { checked: newScore !== 0 } }, newScore, item.id, item.parentId);
                                                    }}
                                                />
                                            ) : [2, 9, 16].includes(item.parentId) ? (
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name={item.id}
                                                        checked={selectedScores[item.id] === item.score}
                                                        onChange={(e) => handleCheckboxChange(e, item.score, item.id, item.parentId)}
                                                        disabled={data.data.status !== 'WAIT_STUDENT'}
                                                    />
                                                </label>
                                            ) : (
                                                <input
                                                    type="number"
                                                    {...register(`score_${item.parentId}_${item.id}`, {
                                                        min: -10,
                                                        max: item.maxScore || 10,
                                                        valueAsNumber: true,
                                                        validate: value => (value <= (item.maxScore || 10)) || 'Điểm vượt quá mức quy định',
                                                    })}
                                                    className="input input-bordered w-full"
                                                    disabled={data.data.status !== 'WAIT_STUDENT'}
                                                    defaultValue={item.student_score || item.total_student_score || 0}
                                                    onChange={(e) => {
                                                        const newScore = parseInt(e.target.value) || 0;
                                                        setValue(`score_${item.parentId}_${item.id}`, newScore);
                                                        updateTotalScore(selectedScores);
                                                        if (newScore > (item.maxScore || 10)) {
                                                            setError(`score_${item.parentId}_${item.id}`, { type: 'manual', message: 'Điểm vượt quá mức quy định' });
                                                        } else {
                                                            setError(`score_${item.parentId}_${item.id}`, undefined);
                                                        }
                                                    }}
                                                />
                                            )}
                                            {errors[`score_${item.parentId}_${item.id}`] && (
                                                <span className="text-red-500 text-xs">
                                                    {errors[`score_${item.parentId}_${item.id}`].message}
                                                </span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {item.id === 21 ? 5 + (selectedScores[item.id] || 0) : (item.student_score !== null && item.student_score !== undefined ? item.student_score : (item.total_student_score !== null && item.total_student_score !== undefined ? item.total_student_score : 0))}
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {item.class_committee_score !== null && item.class_committee_score !== undefined ? item.class_committee_score : 0}
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {item.academic_advisor_score !== null && item.academic_advisor_score !== undefined ? item.academic_advisor_score : 0}
                                        </td>
                                    </tr>
                                );
                            }
                        })}
                        <tr>
                            <td className="border border-gray-300 p-2 font-bold">TỔNG CỘNG</td>
                            <td className="border border-gray-300 p-2">{totalScore}</td>
                            <td className="border border-gray-300 p-2">-</td>
                            <td className="border border-gray-300 p-2">-</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-4 text-left">
                    <button
                        type="submit"
                        className="btn bg-[#00AEEF] hover:bg-[#0095cc] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mt-4"
                        disabled={data.data.status !== 'WAIT_STUDENT' || mutation.isLoading}
                    >
                        {mutation.isLoading ? 'Đang gửi...' : 'Gửi điểm'}
                    </button>
                    <Link to="/scores" className="btn bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ml-2 mt-4">Quay lại</Link>
                </div>
            </form>
        </div>
    );
}

export default ScoreDetailPage;