import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getTrainingScoreDetail, submitTrainingScore } from "../../services/score/scoreService";
import { useForm } from 'react-hook-form';
import { useState, useEffect, useMemo } from 'react';

function ScoreDetailPage() {
    const { id } = useParams();
    const queryClient = useQueryClient(); // Get queryClient instance
    const { data, isLoading, error } = useQuery({
        queryKey: ['trainingScoreDetail', id],
        queryFn: () => getTrainingScoreDetail(id),
    });

    console.log('ScoreDetailPage - isLoading:', isLoading);
    console.log('ScoreDetailPage - error:', error);
    console.log('ScoreDetailPage - data:', data);

    const { register, handleSubmit, setValue, getValues, formState: { errors }, trigger, setError } = useForm({
        defaultValues: {},
    });

    const mutation = useMutation({
        mutationFn: (formData) => {
            // Determine which score to send based on current status
            const scoreKey = 
                data?.status === 'WAIT_STUDENT' ? 'student_score' :
                data?.status === 'WAIT_CLASS_COMMITTEE' ? 'class_committee_score' :
                data?.status === 'WAIT_ACADEMIC_ADVISOR' ? 'academic_advisor_score' :
                '';

            const payload = {
                training_score_id: parseInt(id),
                training_score_details: allItems
                    .filter(item => !item.isParent && item.id)
                    .map(item => ({
                        evaluation_content_id: item.id,
                        score: parseInt(getValues(`score_${scoreKey}_${item.parentId || '0'}_${item.id || '0'}`) || 0)
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
    const [active12Id, setActive12Id] = useState(null); // Để theo dõi mục duy nhất được chọn trong 1.2
    const [currentCriterionTotals, setCurrentCriterionTotals] = useState({}); // New state for criterion totals

    // Sử dụng useMemo để tính toán allItems một cách an toàn
    const allItems = useMemo(() => {
        if (!data?.criterions) {
            return []; // Trả về mảng rỗng nếu dữ liệu chưa sẵn sàng
        }
        return data.criterions.flatMap((criterion, criterionIndex) => {
            const parentItem = {
                isParent: true,
                criterionName: criterion.criterion_name,
                maxScore: criterion.id === 3 ? 20 : criterion.max_score,
                serial: `${criterionIndex + 1}`,
                // totalCriterionScore: criterion.total_score // Removed, will be dynamic
            };

            const children = criterion.evaluation_contents.flatMap((content, contentIndex) => {
                const parentContentItem = {
                    ...content,
                    criterionName: content.criterion_name,
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
                            criterionName: content.criterion_name,
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
    }, [data]); // allItems sẽ được tính toán lại khi data thay đổi

    // Function to calculate and set criterion totals
    const calculateAndSetCriterionTotals = () => {
        const newCriterionTotals = {};
        const scoreKey = 
            data?.status === 'WAIT_STUDENT' ? 'student_score' :
            data?.status === 'WAIT_CLASS_COMMITTEE' ? 'class_committee_score' :
            data?.status === 'WAIT_ACADEMIC_ADVISOR' ? 'academic_advisor_score' :
            '';

        data?.criterions.forEach(criterion => {
            let criterionSum = 0;
            criterion.evaluation_contents?.forEach(content => {
                // Summing direct content scores or aggregated parent scores
                const scoreFieldForContent = `score_${scoreKey}_${criterion.id || '0'}_${content.id || '0'}`;
                const contentScore = parseInt(getValues(scoreFieldForContent) || 0);
                criterionSum += contentScore;
            });
            newCriterionTotals[criterion.id] = criterionSum;
        });
        setCurrentCriterionTotals(newCriterionTotals);
        updateTotalScore(); // Update overall total after criterion totals
    };

    useEffect(() => {
        console.log('ScoreDetailPage useEffect triggered. Data:', data);
        if (data?.criterions) {
            let initialTotal = 0;
            const newSelectedScores = {}; // Khởi tạo lại để tránh dữ liệu cũ
            let initialActive12Id = null;

            data.criterions.forEach(criterion => {
                criterion.evaluation_contents?.forEach(content => {
                    if (content.evaluation_content_details) {
                        content.evaluation_content_details.forEach(detail => {
                            // Initialize all score fields
                            setValue(`score_student_${criterion.id || '0'}_${detail.id || '0'}`, detail.student_score || 0);
                            setValue(`score_class_committee_${criterion.id || '0'}_${detail.id || '0'}`, detail.class_committee_score || 0);
                            setValue(`score_advisor_${criterion.id || '0'}_${detail.id || '0'}`, detail.academic_advisor_score || 0);
                            
                            const score = detail.student_score || detail.total_student_score || 0;
                            newSelectedScores[detail.id] = score;
                            initialTotal += score;
                            // Cập nhật active12Id nếu thuộc mục 1.2 và có điểm
                            if (criterion.id === 1 && content.id === 2 && score !== 0) {
                                initialActive12Id = detail.id;
                            }
                        });
                    } else {
                        // Initialize all score fields
                        setValue(`score_student_${criterion.id || '0'}_${content.id || '0'}`, content.student_score || 0);
                        setValue(`score_class_committee_${criterion.id || '0'}_${content.id || '0'}`, content.class_committee_score || 0);
                        setValue(`score_advisor_${criterion.id || '0'}_${content.id || '0'}`, content.academic_advisor_score || 0);

                        const score = content.student_score || content.total_student_score || 0;
                        newSelectedScores[content.id] = score;
                        initialTotal += score;
                    }
                });
            });

            // Xử lý điểm mặc định cho các mục cha
            const score12 = data.criterions.find(c => c.id === 1)?.evaluation_contents?.find(c => c.id === 2);
            if (score12 && score12.evaluation_content_details) {
                const maxChildScore = Math.max(...[3, 4, 5, 6, 7, 8].map(id => getValues(`score_student_1_${id}`) || 0));
                const parentScore = maxChildScore > 0 ? Math.min(maxChildScore, score12.max_score || 10) : 0;
                newSelectedScores[2] = parentScore;
                setValue(`score_student_1_2`, parentScore);
                initialTotal += parentScore;
            }

            const score13 = data.criterions.find(c => c.id === 1)?.evaluation_contents?.find(c => c.id === 9);
            if (score13 && score13.evaluation_content_details) {
                const childSum = [10, 11, 12, 13, 14, 15].reduce((sum, id) => sum + (getValues(`score_student_1_${id}`) || 0), 0);
                const parentScore = childSum !== 0 ? Math.min(4 + childSum, score13.max_score || 10) : 4;
                newSelectedScores[9] = parentScore;
                setValue(`score_student_1_9`, parentScore);
                initialTotal += parentScore;
            }

            const score21 = data.criterions.find(c => c.id === 2)?.evaluation_contents?.find(c => c.id === 16);
            if (score21 && score21.evaluation_content_details) {
                const maxScore = score21.max_score || 0;
                const penalty = [17, 18, 19, 20, 21, 22].reduce((sum, id) => sum + (getValues(`score_student_2_${id}`) || 0), 0);
                // Đảm bảo điểm không âm và không vượt quá maxScore
                const parentScore = Math.min(maxScore, Math.max(0, maxScore + penalty));
                newSelectedScores[16] = parentScore;
                setValue(`score_student_2_16`, parentScore);
                initialTotal += parentScore;
            }

            const score22 = data.criterions.find(c => c.id === 2)?.evaluation_contents?.find(c => c.id === 19);
            if (score22 && score22.evaluation_content_details) {
                const maxScore = score22.max_score || 0;
                const penalty = score22.evaluation_content_details.reduce((sum, detail) => sum + (getValues(`score_student_2_${detail.id}`) || 0), 0);
                const parentScore = Math.max(0, maxScore + penalty);
                newSelectedScores[19] = parentScore;
                setValue(`score_student_2_19`, parentScore);
                initialTotal += parentScore;
            }

            const score23 = data.criterions.find(c => c.id === 2)?.evaluation_contents?.find(c => c.id === 21);
            if (score23) {
                const maxScore = score23.max_score || 0;
                const adjustment = score23.evaluation_content_details?.[0]?.student_score || parseInt(getValues(`score_student_2_21`) || 0);
                const parentScore = Math.max(0, Math.min(maxScore, maxScore + adjustment));
                newSelectedScores[21] = parentScore;
                setValue(`score_student_2_21`, parentScore);
                initialTotal += parentScore;
            }

            setSelectedScores(newSelectedScores);
            setTotalScore(initialTotal);
            setActive12Id(initialActive12Id);
            calculateAndSetCriterionTotals(); // Initial calculation of criterion totals
        }
        console.log('ScoreDetailPage useEffect finished.');
    }, [data, setValue, getValues]);

    const handleCheckboxChange = (e, score, contentId, parentId, scoreType) => {
        const newSelectedScores = { ...selectedScores };
        const isChecked = e.target.checked;
        const scoreFieldName = `score_${scoreType}_${parentId || '0'}_${contentId || '0'}`;

        if (parentId === 2) { // 1.2: chỉ được chọn một
            if (isChecked) {
                // Reset tất cả các mục con khác trong nhóm 1.2 về 0
                [3, 4, 5, 6, 7, 8].forEach(id => {
                    if (id !== contentId) {
                        setValue(`score_${scoreType}_${parentId || '0'}_${id || '0'}`, 0);
                    }
                });
                setValue(scoreFieldName, score);
                setActive12Id(contentId);
            } else {
                setValue(scoreFieldName, 0);
                if (active12Id === contentId) {
                    setActive12Id(null);
                }
            }

            // Tính điểm cho mục cha (1.2)
            const parentContent = allItems.find(item => item.id === parentId);
            const maxScore = parentContent?.max_score || 10;
            const currentMaxChildScore = Math.max(...[3, 4, 5, 6, 7, 8].map(id => getValues(`score_${scoreType}_${parentId || '0'}_${id || '0'}`) || 0));
            const parentScore = currentMaxChildScore > 0 ? Math.min(currentMaxChildScore, maxScore) : 0;
            setValue(`score_${scoreType}_1_2`, parentScore);

        } else if (parentId === 9) { // 1.3: có thể chọn nhiều
            const currentValue = parseInt(getValues(scoreFieldName) || 0);
            const newValue = isChecked ? score : 0; // If checkbox checked, apply score, else 0
            setValue(scoreFieldName, newValue);

            // Tính điểm cho mục cha (1.3)
            const parentContent = allItems.find(item => item.id === parentId);
            const maxScore = parentContent?.max_score || 10;
            const currentSumChildScore = [10, 11, 12, 13, 14, 15].reduce((sum, id) => sum + (getValues(`score_${scoreType}_${parentId || '0'}_${id || '0'}`) || 0), 0);
            const parentScore = currentSumChildScore !== 0 ? Math.min(4 + currentSumChildScore, maxScore) : 4; // Bắt đầu từ 4 điểm
            setValue(`score_${scoreType}_1_9`, parentScore);

        } else if (parentId === 16) { // 2.1
            // Reset tất cả điểm của các mục con về 0
            [17, 18, 19, 20, 21, 22].forEach(id => {
                setValue(`score_${scoreType}_${parentId || '0'}_${id || '0'}`, 0);
            });

            // Nếu checkbox được chọn, cập nhật điểm cho mục con đó
            if (isChecked) {
                setValue(scoreFieldName, score);
            }

            // Tính điểm cho mục cha
            const parentContent = allItems.find(item => item.id === parentId);
            const maxScore = parentContent?.max_score || 15;
            const penalty = [17, 18, 19, 20, 21, 22].reduce((sum, id) => {
                return sum + (getValues(`score_${scoreType}_${parentId || '0'}_${id || '0'}`) || 0);
            }, 0);
            const parentScore = Math.min(maxScore, Math.max(0, maxScore + penalty));
            setValue(`score_${scoreType}_2_16`, parentScore);
        } else if (parentId === 19) { // 2.2
            const parentContent = allItems.find(item => item.id === parentId);
            const maxScore = parentContent?.max_score || 5;
            const penalty = parseInt(getValues(scoreFieldName) || 0);
            const parentScore = Math.max(0, maxScore + penalty);
            setValue(`score_${scoreType}_2_19`, parentScore);
        }

        // Update selectedScores state (for overall total and specific UI logic if needed)
        const updatedScoresForTotal = {};
        allItems.forEach(item => {
            if (!item.isParent && item.id) {
                const currentActiveScore = getValues(`score_${scoreType}_${item.parentId || '0'}_${item.id || '0'}`);
                updatedScoresForTotal[item.id] = currentActiveScore;
            }
        });
        setSelectedScores(updatedScoresForTotal);
        calculateAndSetCriterionTotals(); // Recalculate criterion totals after any score change
        trigger();
    };

    const updateTotalScore = () => {
        let newTotal = 0;
        // Sum from calculated criterion totals
        Object.values(currentCriterionTotals).forEach(score => {
            newTotal += score;
        });
        setTotalScore(newTotal);
    };

    const validateForm = () => {
        let isValid = true;
        const scoreKey = 
            data?.status === 'WAIT_STUDENT' ? 'student_score' :
            data?.status === 'WAIT_CLASS_COMMITTEE' ? 'class_committee_score' :
            data?.status === 'WAIT_ACADEMIC_ADVISOR' ? 'academic_advisor_score' :
            '';

        allItems.forEach(item => {
            if (!item.isParent && item.id) {
                const field = `score_${scoreKey}_${item.parentId || '0'}_${item.id || '0'}`;
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
    if (!data?.criterions || data.criterions.length === 0) { // Sửa đổi điều kiện kiểm tra dữ liệu
        return <div className="container mx-auto p-4">Không có dữ liệu chi tiết để hiển thị.</div>;
    }

    const renderInputField = (item, scoreType, valueKey) => {
        const fieldName = `score_${scoreType}_${item.parentId || '0'}_${item.id || '0'}`;
        const isDisabled = 
            (scoreType === 'student_score' && data?.status !== 'WAIT_STUDENT') ||
            (scoreType === 'class_committee_score' && data?.status !== 'WAIT_CLASS_COMMITTEE') ||
            (scoreType === 'academic_advisor_score' && data?.status !== 'WAIT_ACADEMIC_ADVISOR');

        const commonProps = {
            className: "input input-bordered w-full",
            disabled: isDisabled,
            defaultValue: item[valueKey] || 0,
            onChange: (e) => {
                const newScore = parseInt(e.target.value) || 0;
                setValue(fieldName, newScore);
                // For specific checkbox-like behaviors
                if ([2, 9, 16].includes(item.parentId)) {
                    handleCheckboxChange({ target: { checked: newScore !== 0 } }, newScore, item.id, item.parentId, scoreType);
                } else {
                    calculateAndSetCriterionTotals(); // Call this instead of updateTotalScore directly
                }
                // Manual validation check for positive/negative numbers
                if ([19, 21, 27, 33].includes(item.id)) { // Adjustment scores, should be <= 0
                    if (newScore > 0) {
                        setError(fieldName, { type: 'manual', message: 'Chỉ được nhập số âm hoặc 0' });
                    } else {
                        setError(fieldName, undefined);
                    }
                } else { // Regular scores, should be >= 0
                    if (newScore < 0) {
                        setError(fieldName, { type: 'manual', message: 'Chỉ được nhập số dương hoặc 0' });
                    } else {
                        setError(fieldName, undefined);
                    }
                }

                if (newScore > (item.maxScore || 10)) {
                    setError(fieldName, { type: 'manual', message: 'Điểm vượt quá mức quy định' });
                }
            }
        };

        // Special handling for checkbox inputs based on parentId
        if ([2, 9, 16].includes(item.parentId)) {
            const isChecked = scoreType === 'student_score' ? (item.parentId === 2 ? active12Id === item.id : getValues(fieldName) === item.score) : getValues(fieldName) === item.score;
            return (
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name={item.id}
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(e, item.score, item.id, item.parentId, scoreType)}
                        disabled={isDisabled}
                    />
                </label>
            );
        } else if (item.id === 21) { // Specific number input for item 21
            return (
                <input
                    type="number"
                    {...register(fieldName, {
                        min: -5,
                        max: 0,
                        valueAsNumber: true,
                    })}
                    {...commonProps}
                />
            );
        } else if ([19, 21].includes(item.parentId)) { // ParentId 19 (2.2 penalty), ParentId 21 (2.3 adjustment)
            return (
                <input
                    type="number"
                    {...register(fieldName, {
                        min: -(item.max_score || 5),
                        max: 0,
                        valueAsNumber: true,
                    })}
                    {...commonProps}
                />
            );
        } else { // Default number input
            return (
                <input
                    type="number"
                    {...register(fieldName, {
                        min: -10,
                        max: item.maxScore || 10,
                        valueAsNumber: true,
                        validate: value => (value <= (item.maxScore || 10)) || 'Điểm vượt quá mức quy định',
                    })}
                    {...commonProps}
                />
            );
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</h1>
                <h2 className="text-xl">CƠ SỞ TẠI TP. HỒ CHÍ MINH</h2>
                <p className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p>Độc lập - Tự do - Hạnh phúc</p>
                <h1 className="text-2xl font-bold mt-4">PHIẾU ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN</h1>
                <p>Học kỳ: I     Năm học: 2024-2025</p>
                <p>Họ và tên: .....................................     Ngày sinh: .........................</p>
                <p>Mã số sinh viên: .............................     Lớp: .....................................</p>
            </div> */}
            <form onSubmit={handleSubmit(onSubmitWithValidation)} className="overflow-x-auto">
                <table className="table w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th>Nội dung đánh giá</th>
                            <th>Điểm quy định</th>
                            <th>Sinh viên đánh giá</th>
                            <th>Tập thể lớp đánh giá</th>
                            <th>CVHT đánh giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allItems.map((item, index) => {
                            if (!item) return null; // Thêm kiểm tra cho item không hợp lệ
                            if (item.isParent) {
                                return (
                                    <tr key={`${item.criterionName || 'parent'}_${index}`} className="bg-gray-200">
                                        <td className="border border-gray-300 p-2" colSpan={5}>
                                            <span className="font-bold"> {item.criterionName || 'N/A'}</span>
                                            <br />
                                            <span>Mức điểm tối đa Tiêu chí {item.serial || 'N/A'}: {item.maxScore || 0} điểm</span>
                                            <span className="ml-4 font-bold">Điểm hiện tại: {currentCriterionTotals[item.id] || 0} điểm</span>
                                        </td>
                                    </tr>
                                );
                            } else if (item.evaluation_content_details) {
                                return (
                                    <tr key={`${item.id || 'content-parent'}_${index}`}> {/* Add a fallback key if item.id is undefined */}
                                        <td className="border border-gray-300 p-2" colSpan={5}>
                                            <span className="font-semibold">{item.content || 'N/A'}</span>
                                            <span className="ml-4 font-medium">
                                                Điểm hiện tại: {selectedScores[item.id] !== undefined ? selectedScores[item.id] : (item.id === 19 ? 5 : (item.max_score || 0))}
                                            </span>
                                            <span className="ml-4 font-medium">
                                                Điểm tối đa: {item.max_score || 0}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={`${item.id || item.criterionName || 'item'}_${index}`}> {/* Add fallbacks for key */}
                                        <td className="border border-gray-300 p-2 pl-8">{item.content || 'Chưa có nội dung'}</td>
                                        <td className="border border-gray-300 p-2">{item.maxScore || 0}</td>
                                        <td className="border border-gray-300 p-2">
                                            {renderInputField(item, 'student_score', 'student_score')}
                                            {errors[`score_student_${item.parentId || '0'}_${item.id || '0'}`] && (
                                                <span className="text-red-500 text-xs">
                                                    {errors[`score_student_${item.parentId || '0'}_${item.id || '0'}`].message}
                                                </span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {renderInputField(item, 'class_committee_score', 'class_committee_score')}
                                            {errors[`score_class_committee_${item.parentId || '0'}_${item.id || '0'}`] && (
                                                <span className="text-red-500 text-xs">
                                                    {errors[`score_class_committee_${item.parentId || '0'}_${item.id || '0'}`].message}
                                                </span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {renderInputField(item, 'academic_advisor_score', 'academic_advisor_score')}
                                            {errors[`score_academic_advisor_${item.parentId || '0'}_${item.id || '0'}`] && (
                                                <span className="text-red-500 text-xs">
                                                    {errors[`score_academic_advisor_${item.parentId || '0'}_${item.id || '0'}`].message}
                                                </span>
                                            )}
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
                            <td className="border border-gray-300 p-2">-</td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-4 text-left">
                    <button
                        type="submit"
                        className="btn bg-[#00AEEF] hover:bg-[#0095cc] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mt-4"
                        disabled={mutation.isLoading}
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