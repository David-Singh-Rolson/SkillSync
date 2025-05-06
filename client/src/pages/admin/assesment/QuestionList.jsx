import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  usePublishAssessmentMutation,
  useGetAssessmentByIdQuery,
} from "@/features/api/assessmentApi";
import { toast } from "sonner";
export default function QuestionList({ questions, setQuestions }) {
  const [openIndexes, setOpenIndexes] = useState([]);
  const params = useParams();
  const assessmentId = params.assessmentId;
  const [publishAssessment, {}] = usePublishAssessmentMutation();
  const { data, isLoading, isSuccess, refetch } =
    useGetAssessmentByIdQuery(assessmentId);
  const toggleExpand = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDelete = (indexToDelete) => {
    const updatedQuestions = questions.filter((_, i) => i !== indexToDelete);
    setQuestions(updatedQuestions);
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishAssessment({ assessmentId, query: action });
      if (response.data) {
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish Assessment");
    }
  };

  return (
    <div className="space-y-4">
      {(questions?.length??0) === 0 ? (
        <p className="text-gray-500 text-center">No questions added yet.</p>
      ) : (
        questions.map((q, index) => (
          <Card key={index} className="border border-gray-300">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-t-md">
              <h2 className="font-semibold text-md">
                Q{index + 1}: {q.questionText}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleExpand(index)}
                >
                  {openIndexes.includes(index) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {openIndexes.includes(index) && (
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                  <div className=" flex">
                    <div className="font-semibold w-30 ">Topic:</div>
                    <div>{q.topic}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Difficulty:</span>{" "}
                    {q.difficulty}
                  </div>
                  <div>
                    <span className="font-semibold">Marks:</span> {q.marks}
                  </div>
                  <div>
                    <span className="font-semibold">Type:</span>{" "}
                    {q.questionType}
                  </div>
                </div>

                {(q.questionType === "SingleCorrect" ||
                  q.questionType === "MultiCorrect") && (
                  <div className="mt-4">
                    <span className="font-semibold">Options:</span>
                    <ul className="list-disc ml-6 mt-1 space-y-1">
                      {(q.options ?? []).map((opt, idx) => {
                        const isCorrect =
                          q.questionType === "SingleCorrect"
                            ? idx === q.correctOptionIndex
                            : (q.correctOptionIndexes ?? []).includes(idx)
                        return (
                          <li
                            key={idx}
                            className={
                              isCorrect ? "text-green-600 font-semibold" : ""
                            }
                          >
                            {opt}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {(q.questionType === "TrueFalse" ||
                  q.questionType === "ShortAnswer" ||
                  q.questionType === "Integer") && (
                  <div className="mt-4">
                    <span className="font-semibold">Answer:</span>{" "}
                    {q.correctAnswer || q.answer}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))
      )}

      <div className="space-x-2">
        <Button
        disabled={questions?.length==0}
          variant="outline"
          onClick={() =>
            publishStatusHandler(
              data?.assessment?.isPublished ? "false" : "true"
            )
          }
        >
          {data?.assessment?.isPublished ? "Unpublished" : "Publish"}
        </Button>
        <Button  >Remove Assessment</Button>
      </div>
    </div>
  );
}
