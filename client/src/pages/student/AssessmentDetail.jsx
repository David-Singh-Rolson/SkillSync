import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetchTestQuestionsMutation } from "@/features/api/testAttemptApi";
import { useSelector } from "react-redux";
import Quiz from "@/components/quiz";
import { Loader2 } from "lucide-react";
const AssessmentDetail = () => {
  const params = useParams();
  const testId = params.assessmentId;
  const userId = useSelector((state) => state.auth.user?._id);
  const role = useSelector((state) => state.auth.user?.role);

  const [fetchTestQuestions, { data, isLoading, isError, isSuccess }] =
    useFetchTestQuestionsMutation();

  // Fetch test questions from controller
  useEffect(() => {
    // if (testId && userId && role) {
    fetchTestQuestions({ assessmentId: testId, userId, role });
    // }
  }, [testId]);
  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : isSuccess && data ? (
        <Quiz quizData={data} />
      ) : (
        <div className="text-center text-red-500">
          Something went wrong or no questions found!
        </div>
      )}
    </div>
  );
};

export default AssessmentDetail;
