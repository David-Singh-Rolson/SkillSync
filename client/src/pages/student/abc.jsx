import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchTestQuestionsMutation } from "@/features/api/testAttemptApi";

const AssessmentDetail = () => {
  const { assessmentId } = useParams(); // testId
  const navigate = useNavigate();
  const [fetchTestQuestions, { data, isLoading, isError, isSuccess }] = useFetchTestQuestionsMutation();
  const [timer, setTimer] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
console.log("ques",data);

  useEffect(() => {
    if (assessmentId) {
      fetchTestQuestions(assessmentId);
    }
  }, [assessmentId]);

  useEffect(() => {
    if (data) {
      setTimer(data.timeLimit * 60); // Convert time limit to seconds
    }
  }, [data]);

  useEffect(() => {
    if (timer <= 0) {
      handleAutoSubmit();
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleAutoSubmit = () => {
    // Handle auto-submit logic here
    console.log("Auto-submitting the test...");
    navigate("/dashboard"); // or results page
  };

  const handleSubmit = () => {
    // Submit answers manually here
    console.log("Submitting test with answers:", selectedAnswers);
    navigate("/dashboard"); // or results page
  };

  if (isLoading) return <div>Loading test...</div>;
  if (isError) return <div>Error loading test data.</div>;

  return (
    <div className="p-8 w-full min-h-screen bg-white dark:bg-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{data.testTitle}</h1>
        <span className="font-mono text-red-600">
          Time Left: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
        </span>
      </div>

      {data.questions.map((q, index) => (
        <div key={q._id} className="mb-6">
          <h2 className="font-semibold">
            Q{index + 1}. {q.questionText}
          </h2>
          <div className="ml-4 space-y-2">
            {q.questionType === "MultiCorrect" ? (
              // MultiCorrect (Checkboxes for multiple selections)
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
              // True/False (Radio buttons)
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
              // Single Correct (Radio buttons)
              q.options.map((opt, idx) => (
                <div key={idx}>
                  <input
                    type="radio"
                    id={`q${index}_${idx}`}
                    name={`q${index}`}
                    value={opt}
                    checked={selectedAnswers[q._id] === opt}
                    onChange={() => handleAnswerChange(q._id, opt)}
                  />
                  <label htmlFor={`q${index}_${idx}`}> {opt}</label>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Now
        </button>
        <button
          onClick={handleAutoSubmit}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Auto Submit
        </button>
      </div>
    </div>
  );
};

export default AssessmentDetail;
