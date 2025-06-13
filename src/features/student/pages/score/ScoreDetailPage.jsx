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

    const { register, handleSubmit, setValue, formState: { errors, dirtyFields }, trigger, setError } = useForm({
        defaultValues: {},
    });

    const mutation = useMutation({
        mutationFn: (formData) => {
            const payload = {
                training_score_id: parseInt(id),
                training_score_details: Object.keys(formData).map(key => {
                    const [_, criterionId, contentId] = key.split('_');
                    return {
                        evaluation_content_id: parseInt(contentId),
                        score: formData[key],
                    };
                }),
            };
            return submitTrainingScore(id, payload);
        },
        onSuccess: () => alert('Chấm điểm thành công!'),
        onError: (error) => alert('Lỗi khi chấm điểm: ' + error.message),
    });

    const [selectedScores, setSelectedScores] = useState({});
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        if (data && data.data.criterions) {
            let initialTotal = 0;
            data.data.criterions.forEach(criterion => {
                criterion.evaluation_contents.forEach(content => {
                    if (content.evaluation_content_details) {
                        content.evaluation_content_details.forEach(detail => {
                            const score = detail.student_score || detail.total_student_score || 0;
                            setValue(`score_${criterion.id}_${detail.id}`, score);
                            initialTotal += score;
                        });
                    } else {
                        const score = content.student_score || content.total_student_score || 0;
                        setValue(`score_${criterion.id}_${content.id}`, score);
                        initialTotal += score;
                    }
                });
            });
            setTotalScore(initialTotal || data.data.total_score || 0);

            // Kiểm tra giá trị checkbox mặc định cho 1.2
            const score12 = data.data.criterions.find(c => c.id === 1)?.evaluation_contents.find(c => c.id === 2);
            if (score12 && score12.evaluation_content_details) {
                const defaultScore = score12.evaluation_content_details.find(d => d.student_score === score12.total_student_score)?.score;
                if (defaultScore) {
                    setSelectedScores(prev => ({ ...prev, [2]: defaultScore }));
                }
            }
        }
    }, [data, setValue]);

    const onSubmit = (data) => mutation.mutate(data);

    const validateForm = () => {
        const requiredFields = allItems
            .filter(item => !item.isParent && (item.parentId !== 2 || !selectedScores[2]))
            .map(item => `score_${item.parentId}_${item.id}`);
        let isValid = true;
        requiredFields.forEach(field => {
            if (!errors[field] && !dirtyFields[field]) {
                setError(field, { type: 'required', message: 'Vui lòng điền điểm' });
                isValid = false;
            }
        });
        return isValid;
    };

    const onSubmitWithValidation = async (data) => {
        if (validateForm()) {
            onSubmit(data);
        }
    };

    if (isLoading) return <div className="container mx-auto p-4">Đang tải...</div>;
    if (error) return <div className="container mx-auto p-4">Lỗi: {error.message}</div>;
    if (!data?.data?.criterions || data.data.criterions.length === 0) {
        console.log('Data received:', data);
        return <div className="container mx-auto p-4">Không có dữ liệu chi tiết để hiển thị.</div>;
    }

    // Tạo danh sách phẳng với thụt lề
    const allItems = data.data.criterions.flatMap(criterion => [
        {
            isParent: true,
            criterionName: criterion.criterion_name,
            maxScore: criterion.max_score,
        },
        ...criterion.evaluation_contents.flatMap(content =>
            content.evaluation_content_details
                ? content.evaluation_content_details.map(detail => ({
                    ...detail,
                    parentContent: content.content,
                    criterionName: criterion.criterion_name,
                    isParent: false,
                    maxScore: detail.score,
                    parentId: content.id,
                }))
                : [{
                    ...content,
                    criterionName: criterion.criterion_name,
                    isParent: false,
                    maxScore: content.max_score,
                    parentId: criterion.id,
                }]
        ),
    ]);

    const handleCheckboxChange = (e, score, contentId, parentId) => {
        const newSelectedScores = { ...selectedScores };
        if (newSelectedScores[parentId] === score) {
            newSelectedScores[parentId] = 0;
            setValue(`score_${parentId}_${contentId}`, 0);
        } else {
            newSelectedScores[parentId] = score;
            setValue(`score_${parentId}_${contentId}`, score);
        }
        setSelectedScores(newSelectedScores);
        trigger();
        updateTotalScore(newSelectedScores);
    };

    const updateTotalScore = (scores) => {
        let newTotal = data.data.total_score || 0;
        allItems.forEach(item => {
            if (!item.isParent && item.id) {
                const field = `score_${item.parentId}_${item.id}`;
                newTotal += parseInt(getValues(field) || 0);
                if (scores[item.parentId] && item.id === Object.keys(scores[item.parentId])[0]) {
                    newTotal += scores[item.parentId] - (getValues(field) || 0);
                }
            }
        });
        setTotalScore(newTotal);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Phiếu Điểm Rèn luyện</h1>
            <form onSubmit={handleSubmit(onSubmitWithValidation)} className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>TT</th>
                            <th>Nội dung</th>
                            <th>Điểm tối đa</th>
                            <th>Điểm đánh giá</th>
                            <th>Ban cán sự</th>
                            <th>CVHT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allItems.map((item, index) => (
                            <tr key={`${item.id || item.criterionName}_${index}`} className={item.isParent ? '' : 'pl-4'}>
                                <td>{index + 1}</td>
                                <td>
                                    {item.isParent
                                        ? item.criterionName
                                        : item.parentContent
                                            ? item.content || 'Chưa có nội dung'
                                            : item.content || 'Chưa có nội dung'}
                                </td>
                                <td>{item.maxScore || 0}</td>
                                <td>
                                    {!item.isParent && item.parentId !== 2 && item.maxScore >= 0 && ( // Input cho các mục dương
                                        <input
                                            type="number"
                                            {...register(`score_${item.parentId}_${item.id}`, {
                                                min: -10,
                                                max: item.maxScore || 10,
                                                valueAsNumber: true,
                                                required: 'Vui lòng điền điểm',
                                            })}
                                            className="input input-bordered w-full"
                                            disabled={data.data.status !== 'WAIT_STUDENT'}
                                            defaultValue={item.student_score || item.total_student_score || 0}
                                            onChange={(e) => {
                                                setValue(`score_${item.parentId}_${item.id}`, parseInt(e.target.value));
                                                updateTotalScore(selectedScores);
                                            }}
                                        />
                                    )}
                                    {!item.isParent && (item.parentId === 2 || item.maxScore < 0) && ( // Checkbox cho 1.2 và các mục trừ điểm
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name={item.id}
                                                checked={selectedScores[item.parentId] === item.score}
                                                onChange={(e) => handleCheckboxChange(e, item.score, item.id, item.parentId)}
                                                disabled={data.data.status !== 'WAIT_STUDENT' || (selectedScores[item.parentId] && selectedScores[item.parentId] !== item.score)}
                                            />
                                            <span className="ml-2">{item.content} ({item.score >= 0 ? '+' : ''}{item.score})</span>
                                        </label>
                                    )}
                                    {errors[`score_${item.parentId}_${item.id}`] && <span className="text-red-500 text-xs">{errors[`score_${item.parentId}_${item.id}`].message}</span>}
                                </td>
                                <td>
                                    {!item.isParent && (item.class_committee_score !== null
                                        ? item.class_committee_score
                                        : item.total_class_committee_score || '-')}
                                </td>
                                <td>
                                    {!item.isParent && (item.academic_advisor_score !== null
                                        ? item.academic_advisor_score
                                        : item.total_academic_advisor_score || '-')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4">
                    <p className="text-lg font-bold">Tổng điểm rèn luyện: {totalScore}</p>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={data.data.status !== 'WAIT_STUDENT' || mutation.isLoading || !validateForm()}
                    >
                        {mutation.isLoading ? 'Đang gửi...' : 'Gửi điểm'}
                    </button>
                    <Link to="/scores" className="btn btn-secondary ml-2">Quay lại</Link>
                </div>
            </form>
        </div>
    );
}

export default ScoreDetailPage;