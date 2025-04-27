import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchTestQuestionsMutation ,useSubmitTestAttemptMutation} from "@/features/api/testAttemptApi";
import { useSelector } from 'react-redux';
import Quiz from "@/components/quiz";
import { Loader2 } from "lucide-react";
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


  // Fetch test questions from controller
  useEffect(() => {
    // if (testId && userId && role) {
      fetchTestQuestions({ assessmentId: testId, userId, role });
    // }
  }, [testId]);

  // useEffect(() => {
  //   if (testId && userId && role) {
  //     (async () => {
  //       try {
  //         const response = await fetchTestQuestions({ assessmentId: testId, userId, role }).unwrap();
  //         console.log("Fetched Questions Response:", response);
  //         // You can optionally store response in local state if needed
  //       } catch (error) {
  //         console.error("Error fetching test questions:", error);
  //       }
  //     })();
  //   }
  // }, [testId, userId, role]);
  
  



  const handleAnswerChange = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };
  
  

  // useEffect(() => {
  //   if (timer <= 0) {
  //     handleAutoSubmit();
  //   }
    

  //   const interval = setInterval(() => {
  //     setTimer((prev) => prev - 1);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [timer]);
  console.log("user from auth",JSON.stringify(data));
  // console.log("user from auth",JSON.stringify(data));

  const handleAutoSubmit = () => {
    console.log("Auto-submitting the test...");
  };

  const handleSubmit = () => {
    console.log("submitted",JSON.stringify(selectedAnswers));
    
    submitTestAttempt({attemptId,responses:selectedAnswers})
    console.log("Submitting test with answers:", selectedAnswers);
  };

  


  // return (
  //   <div className="p-8 w-full min-h-screen bg-white dark:bg-gray-800">
  //     <div className="flex justify-between items-center mb-4">
  //       <h1 className="text-xl font-bold">{data?.test?.testTitle}</h1>
  //       <span className="font-mono text-red-600">
  //         Time Left: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}
  //       </span>
        
  //         <button
  //         onClick={handleSubmit}
  //         className="bg-red-600 text-white px-4 py-2 rounded"
  //       >
  //         Submit Now
  //       </button>
  //     </div>
      
  //     {data?.questions.map((q, index) => (
  //       <div key={q._id} className="mb-6">
  //         <h2 className="font-semibold">
  //           Q{index + 1}. {q.questionText}
  //         </h2>
  //         <div className="ml-4 space-y-2">
  //           {q.questionType === "MultiCorrect" ? (
  //             q.options.map((opt, idx) => (
  //               <div key={idx}>
  //                 <input
  //                   type="checkbox"
  //                   id={`q${index}_${idx}`}
  //                   name={`q${index}`}
  //                   value={opt}
  //                   checked={selectedAnswers[q._id]?.includes(opt)}
  //                   onChange={(e) => {
  //                     const selected = selectedAnswers[q._id] || [];
  //                     if (e.target.checked) {
  //                       selected.push(opt);
  //                     } else {
  //                       const index = selected.indexOf(opt);
  //                       if (index > -1) {
  //                         selected.splice(index, 1);
  //                       }
  //                     }
  //                     handleAnswerChange(q._id, selected);
  //                   }}
  //                 />
  //                 <label htmlFor={`q${index}_${idx}`}> {opt}</label>
  //               </div>
  //             ))
  //           ) : q.questionType === "TrueFalse" ? (
  //             <>
  //               <div>
  //                 <input
  //                   type="radio"
  //                   id={`q${index}_true`}
  //                   name={`q${index}`}
  //                   value="True"
  //                   checked={selectedAnswers[q._id] === "True"}
  //                   onChange={() => handleAnswerChange(q._id, "True")}
  //                 />
  //                 <label htmlFor={`q${index}_true`}>True</label>
  //               </div>
  //               <div>
  //                 <input
  //                   type="radio"
  //                   id={`q${index}_false`}
  //                   name={`q${index}`}
  //                   value="False"
  //                   checked={selectedAnswers[q._id] === "False"}
  //                   onChange={() => handleAnswerChange(q._id, "False")}
  //                 />
  //                 <label htmlFor={`q${index}_false`}>False</label>
  //               </div>
  //             </>
  //           ) : (
  //             q.options.map((opt, idx) => (
  //               <div key={idx}>
  //                 <input
  //                   type="radio"
  //                   id={`q${index}_${idx}`}
  //                   name={`q${index}`}
  //                   value={opt}
  //                   checked={selectedAnswers[q._id] === idx}
  //                   onChange={() => handleAnswerChange(q._id, idx)}
  //                 />
  //                 <label htmlFor={`q${index}_${idx}`}> {opt}</label>
  //               </div>
  //             ))
  //           )}
  //         </div>
  //       </div>
  //     ))}

     
  //   </div>
  //   // <Quiz data={data?.questions}/>
  // );
  return (
    <div>
      {isLoading ? (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
  </div>
) : isSuccess && data? (
  <Quiz quizData={data} />
) : (
  <div className="text-center text-red-500">Something went wrong or no questions found!</div>
)}
    </div>
  )
    

  
};

export default AssessmentDetail;
