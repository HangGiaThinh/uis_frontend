import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const TrainingScoreDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainingScoreData, setTrainingScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRadio1_2, setSelectedRadio1_2] = useState(null);
  const [hasZeroScores, setHasZeroScores] = useState(false);
  const [showZeroScoreWarning, setShowZeroScoreWarning] = useState(false);
  const [showRequiredWarning1_2, setShowRequiredWarning1_2] = useState(false);
  const [showAllWarnings, setShowAllWarnings] = useState(false);

  const getStatusInVietnamese = (status) => {
    switch (status) {
      case 'WAIT_STUDENT':
        return 'Chờ sinh viên';
      case 'WAIT_CLASS_COMMITTEE':
        return 'Chờ ban cán sự';
      case 'WAIT_ADVISOR':
        return 'Chờ CVHT';
      case 'WAIT_FACULTY':
        return 'Chờ khoa';
      case 'WAIT_DEPARTMENT':
        return 'Chờ phòng CTSV';
      case 'COMPLETED':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchTrainingScore = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `http://localhost:8080/api/v1/class-committee/training-scores/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrainingScoreData(response.data.data);
        setSelectedRadio1_2(null); // Không chọn radio button nào khi mới vào trang

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingScore();
  }, [id]);

  const handleScoreChange = (contentId, detailId, value) => {
    setTrainingScoreData(prevData => {
      const newCriterions = prevData.criterions.map(criterion => {
        const newEvaluationContents = criterion.evaluation_contents.map(content => {
          if (content.id === contentId) {
            if (detailId === null) {
              if (contentId === 27 || contentId === 33) {
                return {
                  ...content,
                  total_class_committee_score: value ? content.max_score : 0
                };
              }
              let newScore = parseInt(value);
              if (isNaN(newScore)) newScore = 0;
              if (newScore > content.max_score) newScore = content.max_score;
              if (newScore < (content.max_score < 0 ? content.max_score : 0)) newScore = (content.max_score < 0 ? content.max_score : 0);
              return {
                ...content,
                total_class_committee_score: newScore,
              };
            } else if (content.evaluation_content_details) {
              let newDetails = [...content.evaluation_content_details];

              if (content.id === 2) {
                if (detailId === 8) {
                  newDetails = newDetails.map(detail => {
                    if (detail.id === 8) {
                      return { ...detail, class_committee_score: value ? detail.score : 0 };
                    }
                    return detail;
                  });
                } else {
                  setSelectedRadio1_2(detailId);
                  newDetails = newDetails.map(detail => {
                    if (detail.id >= 3 && detail.id <= 7) {
                      return { ...detail, class_committee_score: detail.id === detailId ? detail.score : 0 };
                    }
                    return detail;
                  });
                }
              } else {
                newDetails = newDetails.map(detail => {
                  if (detail.id === detailId) {
                    if ((content.id === 19 && detail.id === 20) || (content.id === 21 && detail.id === 22)) {
                      let incidents = parseInt(value);
                      if (isNaN(incidents)) incidents = 0;
                      if (incidents < 0) incidents = 0;
                      if (incidents > 5) incidents = 5;
                      return { ...detail, class_committee_score: incidents * detail.score };
                    } else {
                      return { ...detail, class_committee_score: value ? detail.score : 0 };
                    }
                  }
                  return detail;
                });
              }

              let newTotalClassCommitteeScore;
              if (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) {
                const deductions = newDetails.reduce((sum, detail) => sum + detail.class_committee_score, 0);
                newTotalClassCommitteeScore = Math.max(0, content.max_score + deductions);
              } else {
                newTotalClassCommitteeScore = newDetails.reduce((sum, detail) => sum + detail.class_committee_score, 0);
              }

              return {
                ...content,
                evaluation_content_details: newDetails,
                total_class_committee_score: newTotalClassCommitteeScore,
              };
            }
          }
          return content;
        });

        return {
          ...criterion,
          evaluation_contents: newEvaluationContents,
        };
      });

      return {
        ...prevData,
        criterions: newCriterions,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      // Kiểm tra điểm 0 trước khi gửi (chỉ kiểm tra các mục có input số)
      const hasZero = trainingScoreData.criterions.some(criterion => 
        criterion.evaluation_contents.some(content => {
          if (content.id === 2 && selectedRadio1_2) {
            return false; // Bỏ qua kiểm tra mục 1.2 nếu đã chọn
          }
          if (content.evaluation_content_details) {
            return content.evaluation_content_details.some(detail => {
              // Loại trừ detail.id 20, 22 và các detail của content.id 9, 16 khỏi kiểm tra hasZero
              if (!((detail.id === 20) || (detail.id === 22) || (detail.id >= 10 && detail.id <= 13) || (detail.id >= 17 && detail.id <= 18))) {
                return detail.class_committee_score === 0;
              }
              return false;
            });
          }
          // Chỉ kiểm tra các mục có input số (không phải checkbox và không phải mục 2.2, 2.3)
          if (content.id !== 27 && content.id !== 33 && content.id !== 3 && content.id !== 4) {
            return content.total_class_committee_score === 0;
          }
          return false;
        })
      );

      if (!selectedRadio1_2 || hasZero) {
        if (!showAllWarnings) {
          setShowRequiredWarning1_2(!selectedRadio1_2);
          setShowZeroScoreWarning(hasZero);
          setShowAllWarnings(true);
          return;
        }
      }

      const token = localStorage.getItem('token');
      const trainingScoreDetails = [];

      // Create a map of all possible IDs (1-36) with default score 0
      const allScores = new Map();
      for (let i = 1; i <= 36; i++) {
        allScores.set(i, 0);
      }

      // Update the map with actual scores from the form
      trainingScoreData.criterions.forEach(criterion => {
        criterion.evaluation_contents.forEach(content => {
          if (content.evaluation_content_details) {
            content.evaluation_content_details.forEach(detail => {
              allScores.set(detail.id, detail.class_committee_score);
            });
          } else {
            allScores.set(content.id, content.total_class_committee_score);
          }
        });
      });

      // Convert the map to the required array format
      allScores.forEach((score, id) => {
        trainingScoreDetails.push({
          evaluation_content_id: id,
          score: score
        });
      });

      const payload = {
        training_score_details: trainingScoreDetails,
      };

      await axios.post(
        `http://localhost:8080/api/v1/class-committee/training-scores/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert("Điểm rèn luyện đã được chấm thành công!");
      navigate(-1);
    } catch (err) {
      console.error("Lỗi khi chấm điểm rèn luyện:", err);
      alert("Có lỗi xảy ra khi chấm điểm rèn luyện. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!trainingScoreData) {
    return <div>No data found.</div>;
  }

  const { criterions, status, total_score } = trainingScoreData;
  const isEditable = status === "WAIT_CLASS_COMMITTEE";
  const totalMaxScore = criterions.reduce((sum, criterion) => sum + criterion.max_score, 0);

  const overallClassCommitteeTotalScore = criterions.reduce((criterionSum, criterion) => {
    return criterionSum + criterion.evaluation_contents.reduce((contentSum, content) => {
      if (content.evaluation_content_details) {
        if (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) {
          const deductions = content.evaluation_content_details.reduce((sum, detail) => sum + detail.class_committee_score, 0);
          return contentSum + Math.max(0, content.max_score + deductions);
        } else {
          return contentSum + content.evaluation_content_details.reduce((detailSum, detail) => detailSum + detail.class_committee_score, 0);
        }
      } else {
        return contentSum + content.total_class_committee_score;
      }
    }, 0);
  }, 0);

  const overallStudentTotalScore = criterions.reduce((criterionSum, criterion) => {
    return criterionSum + criterion.evaluation_contents.reduce((contentSum, content) => {
      if (content.evaluation_content_details) {
        if (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) {
          const deductions = content.evaluation_content_details.reduce((sum, detail) => sum + detail.student_score, 0);
          return contentSum + Math.max(0, content.max_score + deductions);
        } else {
          return contentSum + content.evaluation_content_details.reduce((detailSum, detail) => detailSum + detail.student_score, 0);
        }
      } else {
        return contentSum + content.total_student_score;
      }
    }, 0);
  }, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center justify-between" style={{ backgroundColor: '#40ACE9', color: 'white', padding: '10px 20px', borderRadius: '8px' }}>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Phiếu chấm điểm rèn luyện - Ban cán sự
        </div>
        <span className="ml-2 px-3 py-1 text-sm font-semibold rounded-full bg-white text-blue-800">
          {getStatusInVietnamese(status)}
        </span>
      </h1>
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="py-2 px-4 border border-gray-400">TT</th>
            <th className="py-2 px-4 border border-gray-400 text-left">Nội dung đánh giá</th>
            <th className="py-2 px-4 border border-gray-400">Điểm quy định</th>
            <th className="py-2 px-4 border border-gray-400 text-center">SV đánh giá</th>
            <th className={`py-2 px-4 border border-gray-400 text-center ${isEditable ? 'bg-yellow-100' : ''}`}>Lớp đánh giá</th>
            <th className="py-2 px-4 border border-gray-400 text-center">CVHT đánh giá</th>
          </tr>
        </thead>
        <tbody>
          {criterions.map((criterion, criterionIndex) => (
            <React.Fragment key={criterion.id}>
              <tr className="bg-gray-100 font-semibold hover:bg-gray-50 transition-colors duration-200">
                <td className="py-3 px-4 border border-gray-400"></td>
                <td className="py-3 px-4 border border-gray-400">
                  <span className="text-[#40ACE9] font-bold text-lg">
                    Tiêu chí {criterionIndex + 1}: {criterion.criterion_name.replace(`Tiêu chí ${criterionIndex + 1}: `, "")}
                  </span>
                </td>
                <td className="py-3 px-4 border border-gray-400 text-center font-medium">{criterion.max_score} điểm</td>
                <td className="py-3 px-4 border border-gray-400 text-center"></td>
                <td className={`py-3 px-4 border border-gray-400 text-center ${isEditable ? 'bg-yellow-50' : ''}`}></td>
                <td className="py-3 px-4 border border-gray-400 text-center font-medium">{criterion.score}</td>
              </tr>
              {criterion.evaluation_contents.map((content, contentIndex) => (
                <React.Fragment key={content.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-2 px-4 border border-gray-400 font-medium">{criterionIndex + 1}.{contentIndex + 1}</td>
                    <td className="py-2 px-4 border border-gray-400 font-medium">
                      {content.content}
                      {content.id === 2 && showRequiredWarning1_2 && !selectedRadio1_2 && (
                        <span className="text-red-500 ml-2 text-sm">(Bạn chưa lựa chọn kết quả học tập)</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border border-gray-400 text-center">
                      {content.max_score} điểm
                    </td>
                    <td className="py-2 px-4 border border-gray-400 text-center">
                      {content.evaluation_content_details === null ? (
                        content.total_student_score
                      ) : (
                        (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) ?
                          Math.max(0, content.max_score + content.evaluation_content_details.reduce((sum, detail) => sum + detail.student_score, 0)) :
                          content.total_student_score
                      )}
                    </td>
                    <td className={`py-2 px-4 border border-gray-400 text-center ${isEditable ? 'bg-yellow-50' : ''} ${showAllWarnings && content.total_class_committee_score === 0 && !(content.id === 2 && selectedRadio1_2) && content.id !== 27 && content.id !== 33 && content.id !== 3 && content.id !== 4 && content.id !== 9 && content.id !== 16 ? 'bg-red-100' : ''}`}>
                      {content.evaluation_content_details === null ? (
                        content.id === 27 || content.id === 33 ? (
                          <input
                            type="checkbox"
                            checked={content.total_class_committee_score === content.max_score}
                            className="w-5 h-5 mx-auto text-center ml-3 border border-gray-400"
                            disabled={!isEditable}
                            onChange={(e) => handleScoreChange(content.id, null, e.target.checked ? content.max_score : 0)}
                          />
                        ) : (
                          <div className="flex items-center justify-center">
                            <input
                              type="number"
                              value={content.total_class_committee_score}
                              className="w-20 mx-auto text-center ml-3 border border-gray-400"
                              disabled={!isEditable}
                              onChange={(e) => handleScoreChange(content.id, null, e.target.value)}
                              max={content.max_score}
                              min={content.max_score < 0 ? content.max_score : 0}
                            />
                            {showAllWarnings && content.total_class_committee_score === 0 && !(content.id === 2 && selectedRadio1_2) && content.id !== 27 && content.id !== 33 && content.id !== 3 && content.id !== 4 && content.id !== 9 && content.id !== 16 && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        )
                      ) : (
                        (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) ?
                          Math.max(0, content.max_score + content.evaluation_content_details.reduce((sum, detail) => sum + detail.class_committee_score, 0)) :
                          content.total_class_committee_score
                      )}
                    </td>
                    <td className="py-2 px-4 border border-gray-400 text-center">
                      {content.evaluation_content_details === null ? (
                        content.total_academic_advisor_score
                      ) : (
                        content.total_academic_advisor_score
                      )}
                    </td>
                  </tr>
                  {content.evaluation_content_details && (
                    <>
                      {content.evaluation_content_details.map((detail) => (
                        <tr key={detail.id}>
                          <td className="py-2 px-4 border border-gray-400"></td>
                          <td className="py-2 px-4 border border-gray-400 pl-8">
                            {content.id === 2 && detail.id !== 8 ? (
                              <input
                                type="radio"
                                id={`detail-${detail.id}`}
                                name={`content-${content.id}`}
                                value={detail.id}
                                checked={detail.id === selectedRadio1_2}
                                className="mr-2 border border-gray-400"
                                disabled={!isEditable}
                                onChange={() => handleScoreChange(content.id, detail.id, true)}
                              />
                            ) : (content.id === 19 && detail.id === 20) || (content.id === 21 && detail.id === 22) ? (
                              <input
                                type="number"
                                id={`detail-${detail.id}`}
                                value={detail.class_committee_score !== 0 ? Math.abs(detail.class_committee_score / detail.score) : ''}
                                className="mr-2 w-20 border border-gray-400"
                                disabled={!isEditable}
                                onChange={(e) => handleScoreChange(content.id, detail.id, e.target.value)}
                                min={0}
                                max={5}
                              />
                            ) : (
                              <input
                                type="checkbox"
                                id={`detail-${detail.id}`}
                                checked={detail.class_committee_score === detail.score}
                                className="mr-2 border border-gray-400"
                                disabled={!isEditable}
                                onChange={(e) => handleScoreChange(content.id, detail.id, e.target.checked)}
                              />
                            )}
                            <label htmlFor={`detail-${detail.id}`}>
                              {detail.content}
                            </label>
                          </td>
                          <td className="py-2 px-4 border border-gray-400 text-center">{detail.score} điểm</td>
                          <td className="py-2 px-4 border border-gray-400 text-center">
                            {detail.student_score}
                          </td>
                          <td className={`py-2 px-4 border border-gray-400 text-center ${isEditable ? 'bg-yellow-50' : ''} ${showAllWarnings && detail.class_committee_score === 0 && !(content.id === 2 && selectedRadio1_2) && !((content.id === 19 && detail.id === 20) || (content.id === 21 && detail.id === 22) || content.id === 9 || content.id === 16) ? 'bg-red-100' : ''}`}>
                            <div className="flex items-center justify-center">
                              {detail.class_committee_score}
                              {showAllWarnings && detail.class_committee_score === 0 && !(content.id === 2 && selectedRadio1_2) && !((content.id === 19 && detail.id === 20) || (content.id === 21 && detail.id === 22) || content.id === 9 || content.id === 16) && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-4 border border-gray-400 text-center">{detail.academic_advisor_score}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
          <tr className="font-bold bg-gray-100">
            <td className="py-2 px-4 border border-gray-400"></td>
            <td className="py-2 px-4 border border-gray-400">Tổng điểm rèn luyện</td>
            <td className="py-2 px-4 border border-gray-400 text-center">{totalMaxScore} điểm</td>
            <td className="py-2 px-4 border border-gray-400 text-center">Tổng: {overallStudentTotalScore} điểm</td>
            <td className={`py-2 px-4 border border-gray-400 text-center ${isEditable ? 'bg-yellow-100' : ''}`}>Tổng: {overallClassCommitteeTotalScore} điểm</td>
            <td className="py-2 px-4 border border-gray-400 text-center">{total_score} điểm</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex flex-col items-end space-y-2">
        {isEditable && (showZeroScoreWarning || showRequiredWarning1_2) && (
          <div className="text-red-500 font-medium mb-2">
            {showRequiredWarning1_2 && !selectedRadio1_2 && (
              <div>Bạn chưa lựa chọn kết quả học tập</div>
            )}
            {showZeroScoreWarning && (
              <div>Hãy kiểm tra lại những mục 0 điểm</div>
            )}
          </div>
        )}
        <div className="flex space-x-2">
          {isEditable && (
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {showZeroScoreWarning || showRequiredWarning1_2 ? 'Tiếp tục' : 'Gửi điểm'}
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingScoreDetailPage; 