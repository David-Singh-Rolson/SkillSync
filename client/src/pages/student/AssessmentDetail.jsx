import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchTestQuestionsMutation ,useSubmitTestAttemptMutation} from "@/features/api/testAttemptApi";
import { useSelector } from 'react-redux';
const AssessmentDetail = () => {
  const params = useParams();
  const testId = params.assessmentId;
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user?._id);
  const role = useSelector((state) => state.auth.user?.role);
  
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [fetchTestQuestions, { data, isLoading, isError, isSuccess }] = useFetchTestQuestionsMutation();
  const [submitTestAttempt,{data:submitTestData,isLoading:submitTestLoading,isSuccess:submitTestSuccess}]=useSubmitTestAttemptMutation();
  const attemptId=data?.attemptId
  // Fullscreen state
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Fetch test questions from controller
  useEffect(() => {
    if (testId) {
      fetchTestQuestions({assessmentId: testId,userId,role});
    }
  }, [testId]);

  // useEffect(() => {
  //   if (data) {
  //     toggleFullScreen()
  //     setTimer(data?.test?.timeLimit * 60); // Convert time limit to seconds
  //   }
  // }, [data]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };
  useEffect(() => {
    console.log("Is Fullscreen active?", checkFullScreen());
  }, []);
  

  // useEffect(() => {
  //   if (timer <= 0) {
  //     handleAutoSubmit();
  //   }
    

  //   const interval = setInterval(() => {
  //     setTimer((prev) => prev - 1);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [timer]);
  console.log("user from auth",);
  // console.log("user from auth",JSON.stringify(data));

  const handleAutoSubmit = () => {
    console.log("Auto-submitting the test...");
  };

  const handleSubmit = () => {
    submitTestAttempt({attemptId,responses:selectedAnswers})
    console.log("Submitting test with answers:", selectedAnswers);
  };
  const checkFullScreen = () => {
    const isFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
  
    return isFullscreen;
  };
  
  // Fullscreen toggle function
  const toggleFullScreen = () => {
    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // For Safari
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen(); // For Firefox
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // For IE/Edge
      }
    } else {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(); // For Safari
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen(); // For Firefox
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(); // For IE/Edge
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="p-8 w-full min-h-screen bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{data?.test?.testTitle}</h1>
        <span className="font-mono text-red-600">
          Time Left: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
        </span>
        
          <button
          onClick={handleSubmit}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Submit Now
        </button>
      </div>
      
      {data?.questions.map((q, index) => (
        <div key={q._id} className="mb-6">
          <h2 className="font-semibold">
            Q{index + 1}. {q.questionText}
          </h2>
          <div className="ml-4 space-y-2">
            {q.questionType === "MultiCorrect" ? (
              q.options.map((opt, idx) => (
                <div key={idx}>
                  <input
                    type="checkbox"
                    id={`q${index}_${idx}`}
                    name={`q${index}`}
                    value={opt}
                    checked={selectedAnswers[q._id]?.includes(opt)}
                    onChange={(e) => {
                      const selected = selectedAnswers[q._id] || [];
                      if (e.target.checked) {
                        selected.push(opt);
                      } else {
                        const index = selected.indexOf(opt);
                        if (index > -1) {
                          selected.splice(index, 1);
                        }
                      }
                      handleAnswerChange(q._id, selected);
                    }}
                  />
                  <label htmlFor={`q${index}_${idx}`}> {opt}</label>
                </div>
              ))
            ) : q.questionType === "TrueFalse" ? (
              <>
                <div>
                  <input
                    type="radio"
                    id={`q${index}_true`}
                    name={`q${index}`}
                    value="True"
                    checked={selectedAnswers[q._id] === "True"}
                    onChange={() => handleAnswerChange(q._id, "True")}
                  />
                  <label htmlFor={`q${index}_true`}>True</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id={`q${index}_false`}
                    name={`q${index}`}
                    value="False"
                    checked={selectedAnswers[q._id] === "False"}
                    onChange={() => handleAnswerChange(q._id, "False")}
                  />
                  <label htmlFor={`q${index}_false`}>False</label>
                </div>
              </>
            ) : (
              q.options.map((opt, idx) => (
                <div key={idx}>
                  <input
                    type="radio"
                    id={`q${index}_${idx}`}
                    name={`q${index}`}
                    value={opt}
                    checked={selectedAnswers[q._id] === idx}
                    onChange={() => handleAnswerChange(q._id, idx)}
                  />
                  <label htmlFor={`q${index}_${idx}`}> {opt}</label>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

     
    </div>
  );
};

export default AssessmentDetail;
