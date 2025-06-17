import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaPaperPlane, FaCheck, FaArrowLeft } from 'react-icons/fa';

const ScoreDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainingScoreData, setTrainingScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [selectedRadio1_2, setSelectedRadio1_2] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [validationErrors, setValidationErrors] = useState(new Set());

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
      case 'EXPIRED':
        return 'Hết hạn';
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchTrainingScore = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        setUserRole(role);

        const response = await axios.get(
          `http://localhost:8080/api/v1/student/training-scores/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrainingScoreData(response.data.data);

        const criterion1 = response.data.data.criterions.find(c => c.id === 1);
        if (criterion1) {
          const content2 = criterion1.evaluation_contents.find(c => c.id === 2);
          if (content2 && content2.evaluation_content_details) {
            const selectedNonZeroDetail = content2.evaluation_content_details.find(
              d => d.id >= 3 && d.id <= 6 && d.student_score === d.score && d.score !== 0
            );

            if (selectedNonZeroDetail) {
              setSelectedRadio1_2(selectedNonZeroDetail.id);
            } else {
              const selectedZeroDetail = content2.evaluation_content_details.find(
                d => d.id === 7 && d.student_score === d.score && d.score === 0
              );
              const anyOtherRadioSelectedNonZero = content2.evaluation_content_details.some(
                d => d.id >= 3 && d.id <= 6 && d.student_score === d.score && d.score !== 0
              );

              if (selectedZeroDetail && !anyOtherRadioSelectedNonZero) {
                setSelectedRadio1_2(selectedZeroDetail.id);
              } else {
                setSelectedRadio1_2(null); // No radio selected initially
              }
            }
          }
        }

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingScore();
  }, [id]);

  const handleScoreChange = (contentId, detailId, value) => {
    // Reset validation when user makes changes
    if (showValidation) {
      resetValidation();
    }
    
    setTrainingScoreData(prevData => {
      const newCriterions = prevData.criterions.map(criterion => {
        const newEvaluationContents = criterion.evaluation_contents.map(content => {
          if (content.id === contentId) {
            if (detailId === null) {
              if (contentId === 27 || contentId === 33) {
                return {
                  ...content,
                  total_student_score: value ? content.max_score : 0
                };
              }
              let newScore = parseInt(value);
              if (isNaN(newScore)) newScore = 0;
              if (newScore > content.max_score) newScore = content.max_score;
              if (newScore < (content.max_score < 0 ? content.max_score : 0)) newScore = (content.max_score < 0 ? content.max_score : 0);
              return {
                ...content,
                total_student_score: newScore,
              };
            } else if (content.evaluation_content_details) {
              let newDetails = [...content.evaluation_content_details];

              if (content.id === 2) {
                if (detailId === 8) {
                  newDetails = newDetails.map(detail => {
                    if (detail.id === 8) {
                      return { ...detail, student_score: value ? detail.score : 0 };
                    }
                    return detail;
                  });
                } else {
                  setSelectedRadio1_2(detailId);
                  newDetails = newDetails.map(detail => {
                    if (detail.id >= 3 && detail.id <= 7) {
                      return { ...detail, student_score: detail.id === detailId ? detail.score : 0 };
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
                      return { ...detail, student_score: incidents * detail.score };
                    } else {
                      return { ...detail, student_score: value ? detail.score : 0 };
                    }
                  }
                  return detail;
                });
              }

              let newTotalStudentScore;
              if (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) {
                const deductions = newDetails.reduce((sum, detail) => sum + detail.student_score, 0);
                newTotalStudentScore = Math.max(0, content.max_score + deductions);
              } else {
                newTotalStudentScore = newDetails.reduce((sum, detail) => sum + detail.student_score, 0);
              }

              return {
                ...content,
                evaluation_content_details: newDetails,
                total_student_score: newTotalStudentScore,
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

  const validateForm = () => {
    const errors = new Set();
    
    trainingScoreData.criterions.forEach(criterion => {
      criterion.evaluation_contents.forEach(content => {
        // Check if content 1.2 (id=2) has no radio selected
        if (content.id === 2) {
          const hasRadioSelected = content.evaluation_content_details.some(
            detail => detail.id >= 3 && detail.id <= 7 && detail.student_score === detail.score
          );
          if (!hasRadioSelected) {
            errors.add(`content-${content.id}-radio`);
          }
        }
        
        // Check number inputs with 0 score (excluding content 2.2 and 2.3 details)
        if (content.evaluation_content_details === null) {
          // For direct input contents
          if (content.total_student_score === 0 && content.max_score > 0) {
            errors.add(`content-${content.id}`);
          }
        }
      });
    });
    
    setValidationErrors(errors);
    return errors.size === 0;
  };

  const handleSubmit = async () => {
    if (!showValidation) {
      // First click - show validation
      const isValid = validateForm();
      setShowValidation(true);
      if (!isValid) {
        return;
      }
    }
    
    try {
      const token = localStorage.getItem('token');
      const trainingScoreDetails = [];

      // First, create a map of all possible IDs (1-36) with default score 0
      const allScores = new Map();
      for (let i = 1; i <= 36; i++) {
        allScores.set(i, 0);
      }

      // Then, update the map with actual scores from the form
      trainingScoreData.criterions.forEach(criterion => {
        criterion.evaluation_contents.forEach(content => {
          if (content.evaluation_content_details) {
            // For content with details, send the details scores
            content.evaluation_content_details.forEach(detail => {
              allScores.set(detail.id, detail.student_score);
            });
            
            // Calculate and set the total score for the main content
            let calculatedTotal;
            if (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) {
              const deductions = content.evaluation_content_details.reduce((sum, detail) => sum + detail.student_score, 0);
              calculatedTotal = Math.max(0, content.max_score + deductions);
            } else {
              calculatedTotal = content.evaluation_content_details.reduce((sum, detail) => sum + detail.student_score, 0);
            }
            allScores.set(content.id, calculatedTotal);
          } else {
            // For content without details, use the total score directly
            allScores.set(content.id, content.total_student_score);
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
        `http://localhost:8080/api/v1/student/training-scores/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert("Điểm rèn luyện đã được gửi thành công!");
      navigate(-1);
    } catch (err) {
      console.error("Lỗi khi gửi điểm rèn luyện:", err);
      alert("Có lỗi xảy ra khi gửi điểm rèn luyện. Vui lòng thử lại.");
    }
  };

  const resetValidation = () => {
    setShowValidation(false);
    setValidationErrors(new Set());
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
  const isEditable = status === "WAIT_STUDENT" && status !== "EXPIRED" && (userRole === "STUDENT" || userRole === "CLASS_COMMITTEE");
  const totalMaxScore = criterions.reduce((sum, criterion) => sum + criterion.max_score, 0);

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
          Phiếu đánh giá điểm rèn luyện
        </div>
        <span className="ml-2 px-3 py-1 text-sm font-semibold rounded-full bg-white text-blue-800">
          {getStatusInVietnamese(status)}
        </span>
      </h1>

      {/* Cảnh báo trạng thái EXPIRED */}
      {status === 'EXPIRED' && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ⏰ Phiếu đánh giá đã hết hạn
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Thời gian chấm điểm rèn luyện đã kết thúc. Bạn chỉ có thể xem thông tin mà không thể chỉnh sửa.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="py-2 px-4 border border-gray-400">TT</th>
            <th className="py-2 px-4 border border-gray-400 text-left">Nội dung đánh giá</th>
            <th className="py-2 px-4 border border-gray-400">Điểm quy định</th>
            <th className={`py-2 px-4 border border-gray-400 text-center ${isEditable ? 'bg-yellow-100' : ''}`}>SV đánh giá</th>
            <th className="py-2 px-4 border border-gray-400 text-center">Lớp đánh giá</th>
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
                <td className={`py-3 px-4 border border-gray-400 text-center font-medium ${isEditable ? 'bg-yellow-50' : ''}`}>
                  {criterion.evaluation_contents.reduce((sum, content) => {
                    if (content.evaluation_content_details) {
                      if (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) {
                        const deductions = content.evaluation_content_details.reduce((detailSum, detail) => detailSum + detail.student_score, 0);
                        return sum + Math.max(0, content.max_score + deductions);
                      } else {
                        return sum + content.evaluation_content_details.reduce((detailSum, detail) => detailSum + detail.student_score, 0);
                      }
                    } else {
                      return sum + content.total_student_score;
                    }
                  }, 0)} điểm
                </td>
                <td className="py-3 px-4 border border-gray-400 text-center font-medium">
                  {criterion.evaluation_contents.reduce((sum, content) => {
                    if (content.evaluation_content_details) {
                      if (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) {
                        const deductions = content.evaluation_content_details.reduce((detailSum, detail) => detailSum + detail.class_committee_score, 0);
                        return sum + Math.max(0, content.max_score + deductions);
                      } else {
                        return sum + content.evaluation_content_details.reduce((detailSum, detail) => detailSum + detail.class_committee_score, 0);
                      }
                    } else {
                      return sum + content.total_class_committee_score;
                    }
                  }, 0)} điểm
                </td>
                <td className="py-3 px-4 border border-gray-400 text-center font-medium">
                  {criterion.evaluation_contents.reduce((sum, content) => {
                    if (content.evaluation_content_details) {
                      if (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) {
                        const deductions = content.evaluation_content_details.reduce((detailSum, detail) => detailSum + detail.academic_advisor_score, 0);
                        return sum + Math.max(0, content.max_score + deductions);
                      } else {
                        return sum + content.evaluation_content_details.reduce((detailSum, detail) => detailSum + detail.academic_advisor_score, 0);
                      }
                    } else {
                      return sum + content.total_academic_advisor_score;
                    }
                  }, 0)} điểm
                </td>
              </tr>
              {criterion.evaluation_contents.map((content, contentIndex) => (
                <React.Fragment key={content.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-2 px-4 border border-gray-400 font-medium">{criterionIndex + 1}.{contentIndex + 1}</td>
                    <td className="py-2 px-4 border border-gray-400 font-medium">
                      {content.content}
                      {/* Warning for content 1.2 if no radio selected */}
                      {showValidation && validationErrors.has(`content-${content.id}-radio`) && (
                        <div className="text-red-500 text-sm mt-1">
                          ⚠️ Chưa chọn kết quả học tập
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border border-gray-400 text-center">
                      {content.max_score} điểm
                    </td>
                    <td className={`py-2 px-4 border border-gray-400 text-center ${isEditable ? 'bg-yellow-50' : ''}`}>
                      {content.evaluation_content_details === null ? (
                        content.id === 27 || content.id === 33 ? (
                          <input
                            type="checkbox"
                            checked={content.total_student_score === content.max_score}
                            className="w-5 h-5 mx-auto text-center ml-3 border border-gray-400"
                            disabled={!isEditable}
                            onChange={(e) => handleScoreChange(content.id, null, e.target.checked ? content.max_score : 0)}
                          />
                        ) : (
                          <div className="flex items-center justify-center">
                            <input
                              type="number"
                              value={content.total_student_score}
                              className={`w-20 mx-auto text-center border ${showValidation && validationErrors.has(`content-${content.id}`) ? 'border-red-500' : 'border-gray-400'}`}
                              disabled={!isEditable}
                              onChange={(e) => handleScoreChange(content.id, null, e.target.value)}
                              max={content.max_score}
                              min={content.max_score < 0 ? content.max_score : 0}
                            />
                            {showValidation && validationErrors.has(`content-${content.id}`) && (
                              <span className="text-red-500 ml-1">⚠️</span>
                            )}
                          </div>
                        )
                      ) : (
                        (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) ?
                          Math.max(0, content.max_score + content.evaluation_content_details.reduce((sum, detail) => sum + detail.student_score, 0)) :
                          content.total_student_score
                      )}
                    </td>
                    <td className="py-2 px-4 border border-gray-400 text-center">
                      {content.evaluation_content_details === null ? (
                        <input
                          type="number"
                          value={content.total_class_committee_score}
                          className="w-20 mx-auto text-center ml-3 border border-gray-400"
                          disabled={true}
                          readOnly
                          max={content.max_score}
                          min={content.max_score < 0 ? content.max_score : 0}
                        />
                      ) : (
                        content.total_class_committee_score
                      )}
                    </td>
                    <td className="py-2 px-4 border border-gray-400 text-center">
                      {content.evaluation_content_details === null ? (
                        <input
                          type="number"
                          value={content.total_academic_advisor_score}
                          className="w-20 mx-auto text-center ml-3 border border-gray-400"
                          disabled={true}
                          readOnly
                          max={content.max_score}
                          min={content.max_score < 0 ? content.max_score : 0}
                        />
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
                                value={detail.student_score !== 0 ? Math.abs(detail.student_score / detail.score) : ''}
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
                                checked={detail.student_score === detail.score}
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
                          <td className={`py-2 px-4 border border-gray-400 text-center ${isEditable ? 'bg-yellow-50' : ''}`}>
                            {detail.student_score}
                          </td>
                          <td className="py-2 px-4 border border-gray-400 text-center">{detail.class_committee_score}</td>
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
            <td className={`py-2 px-4 border border-gray-400 text-center ${isEditable ? 'bg-yellow-100' : ''}`}>
              {overallStudentTotalScore} điểm
            </td>
            <td className="py-2 px-4 border border-gray-400 text-center">
              {criterions.reduce((criterionSum, criterion) => {
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
              }, 0)} điểm
            </td>
            <td className="py-2 px-4 border border-gray-400 text-center">
              {criterions.reduce((criterionSum, criterion) => {
                return criterionSum + criterion.evaluation_contents.reduce((contentSum, content) => {
                  if (content.evaluation_content_details) {
                    if (content.id === 9 || content.id === 16 || content.id === 19 || content.id === 21) {
                      const deductions = content.evaluation_content_details.reduce((sum, detail) => sum + detail.academic_advisor_score, 0);
                      return contentSum + Math.max(0, content.max_score + deductions);
                    } else {
                      return contentSum + content.evaluation_content_details.reduce((detailSum, detail) => detailSum + detail.academic_advisor_score, 0);
                    }
                  } else {
                    return contentSum + content.total_academic_advisor_score;
                  }
                }, 0);
              }, 0)} điểm
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4">
        {showValidation && validationErrors.size > 0 && (
          <div className="mb-3 text-center">
            <p className="text-red-500 font-medium">
              Kiểm tra kỹ lại các ô 0đ. Hãy đảm bảo đã đánh giá tất cả các mục
            </p>
          </div>
        )}
        <div className="flex justify-end space-x-2">
          {isEditable && (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 border border-[#F54900] text-[#F54900] rounded-md hover:bg-[#F54900] hover:text-white transition-colors duration-200 ease-in-out mt-4 md:mt-0"
            >
              {showValidation && validationErrors.size > 0 ? (
                <>
                  <FaCheck className="text-sm" />
                  Xác nhận
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-sm" />
                  Gửi
                </>
              )}
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 border border-[#40ACE9] text-[#40ACE9] rounded-md hover:bg-[#40ACE9] hover:text-white transition-colors group mt-4 md:mt-0"
          >
            <FaArrowLeft className="text-sm" />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreDetailPage;