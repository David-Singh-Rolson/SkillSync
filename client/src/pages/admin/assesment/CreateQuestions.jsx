import { useEffect, useState } from "react";
import QuestionForm from "./QuestionForm";
import SingleCorrectQuestion from "./SingleCorrectQuestion";
import MultiCorrectQuestion from "./MultiCorrectQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import ShortAnswerQuestion from "./ShortAnswerQuestion";
import IntegerQuestion from "./IntegerQuestion";
import { Button } from "@/components/ui/button";
import QuestionPreview from "./QuestionPreview";
import QuestionList from "./QuestionList";
import { useCreateNewQuestionMutation } from "@/features/api/questionApi";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useAddQuestionMutation } from "@/features/api/assessmentApi";
import { useGetQuestionByAssessmentIdQuery } from "@/features/api/assessmentApi";
import CreateMcqAI from "./CreateMcqAI";
import { Sparkles } from "lucide-react";
export default function CreateQuestions() {
  const params = useParams();
  const assessmentId = params.assessmentId;
  const [mcqAI, setMcqAI] = useState(false);
  const [generatedQuestion, setGeneratedQuestion] = useState({
    questionText: "",
    topic: "",
    difficulty: "",
    marks: 0,
    questionType: "",
    options: ["", ""],
    correctOptionIndex: null, // for single correct
    correctOptionIndexes: [], // for multicorrect
    correctAnswer: null, // for integer
    answer: "", // for short or one word
  });

  const [question, setQuestion] = useState({
    questionText: "",
    topic: "",
    difficulty: "",
    marks: 0,
    questionType: "",
    options: ["", ""],
    correctOptionIndex: null, // for single correct
    correctOptionIndexes: [], // for multicorrect
    correctAnswer: null, // for integer
    answer: "", // for short or one word
  });
  const [showPreview, setShowPreview] = useState(false);
  const [generatedData, setGeneratedData] = useState({}); // for ai gen ques
  const [questionList, setQuestionList] = useState([]);
  const [createNewQuestion, { data, isLoading, isSuccess, isError }] =
    useCreateNewQuestionMutation();
  const [
    addQuestion,
    {
      data: dataAddInAssessment,
      isLoading: addInAssLoading,
      isSuccess: addInAssSuccess,
    },
  ] = useAddQuestionMutation();
  const {
    data: getQuesByAssIdData,
    isLoading: getQuesLoading,
    isSuccess: getQuesSuccess,
    refetch: refetchQuestions,
  } = useGetQuestionByAssessmentIdQuery(assessmentId);

  const handleChange = (field, value) => {
    setQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // useEffect(() => {
  //   console.log("ques by  asssid", getQuesByAssIdData?.assessment?.questions);
  // }, [getQuesByAssIdData]);

  const handleGeneratedData = async (data) => {
    setGeneratedData(data); // Store the received data (object) in generatedData
    // console.log("Received generated data:", generatedData);
    if(data){
      const { questions } = data;
      // console.log("gen ai data",generatedData);
      if(questions?.SingleCorrect){
        for (const questionData of questions?.SingleCorrect) {
          // Update state with the current question data
          setGeneratedQuestion({
            questionText: questionData.questionText,
            topic: questionData.topic,
            difficulty: questionData.difficulty,
            marks:questionData.marks ? questionData.marks : 0, // Default marks, can be adjusted
            questionType: questionData.questionType,
            options: questionData.options,
            correctOptionIndex: questionData.correctOptionIndex,
            correctOptionIndexes: [], // Empty for single correct, can be used for multi correct
            correctAnswer: "", // Empty for single correct, used for integer or text-based answers
            answer: "", // Used for short or one-word answers
          });
    
          // Now call handleSubmit for this individual question
          await handleSubmitAI();
        }
      }
      else if(questions?.MultiCorrect){
        for(const questionData of questions.MultiCorrect){
          setGeneratedQuestion({
            questionText: questionData.questionText,
            topic: questionData.topic,
            difficulty: questionData.difficulty,
            marks: questionData.marks ? questionData.marks : 0, // Ternary operator for marks
            questionType: questionData.questionType,
            options: questionData.options,
            correctOptionIndexes: questionData.correctOptionIndexes || [], // Handle multi-correct options
            correctOptionIndex: null, // Set to null for multi-correct (used for single correct)
            correctAnswer: "", // Empty for multi-correct, used for integer or text-based answers
            answer: "", // Used for short or one-word answers
          });
          await handleSubmitAI();
        }
      }
      else if(questions?.TrueFalse){
        for(const questionData of questions.TrueFalse) {
          setGeneratedQuestion({
            questionText: questionData.questionText,
            topic: questionData.topic,
            difficulty: questionData.difficulty,
            marks: questionData.marks ? questionData.marks : 0, // Ternary for marks
            questionType: questionData.questionType,
            options: questionData.options,
            correctOptionIndex: questionData.correctOptionIndex || null, // Correct option for True/False questions
            correctOptionIndexes: [], // Empty array for multi-correct questions (not used here)
            correctAnswer: "", // Empty for True/False, used for integer or text-based answers
            answer: "", // Used for short or one-word answers
          });
      
          // Call handleSubmit for each question
          await handleSubmitAI();
        }
      }
      else if(questions?.ShortAnswer){
        for(const questionData of questions.ShortAnswer) {
          setGeneratedQuestion({
            questionText: questionData.questionText,
            topic: questionData.topic,
            difficulty: questionData.difficulty,
            marks: questionData.marks ? questionData.marks : 0, // Ternary for marks
            questionType: questionData.questionType,
            options: [], // No options for short answer questions
            correctOptionIndex: null, // No options, so null for this field
            correctOptionIndexes: [], // Not used for short answer
            correctAnswer:"", // Store correct short answer
            answer:  questionData.correctAnswer || "", // Initially empty for short answer
          });
      
          // Call handleSubmit for each question
          handleSubmitAI();
        }
      }
      else if(questions?.Integer){
        for(const questionData of questions.Integer) {
          setGeneratedQuestion({
            questionText: questionData.questionText,
            topic: questionData.topic,
            difficulty: questionData.difficulty,
            marks: questionData.marks ? questionData.marks : 0, // Ternary for marks
            questionType: questionData.questionType,
            options: [], // No options for integer-based questions
            correctOptionIndex: null, // Not needed for integer-based questions
            correctOptionIndexes: [], // Not needed for integer-based questions
            correctAnswer: questionData.correctAnswer || 0, // Store integer answer
            answer: "", // Initially empty for integer-based questions
          });
      
          // Call handleSubmit for each question
          await handleSubmitAI();
        }
      }
    }
  };

  const handleSubmitAI = async () => {
    try {
      const res = await createNewQuestion(generatedQuestion).unwrap(); // unwrap to handle success/failure properly

      const questionId = res.currentQuestion._id;

      const newRes = await addQuestion({ assessmentId, questionId }).unwrap();

      await refetchQuestions();
      setQuestionList((prev) => [...prev, res.question || question]); // res.question if backend returns created object

      // Reset form
      setGeneratedQuestion({
        questionText: "",
        topic: "",
        difficulty: "",
        marks: 0,
        questionType: "",
        options: ["", ""],
        correctOptionIndex: null,
        correctOptionIndexes: [],
        correctIntegerAnswer: null,
        correctAnswer: "",
      });
      setShowPreview(false);
      if (isSuccess) {
        toast.message("Question created successfully");
      } else if (isError) {
        toast.error("Error creating question, Try Again");
      }
    } catch (err) {
      console.error("Error saving question", err);
      // Optional: show toast or error message to user
    }
  };
  const handleSubmit = async () => {
    try {
      if (  question.questionType === "TrueFalse") {
        question.options = ["True", "False"];
      }
      const res = await createNewQuestion(question).unwrap(); // unwrap to handle success/failure properly

      const questionId = res.currentQuestion._id;

      const newRes = await addQuestion({ assessmentId, questionId }).unwrap();

      await refetchQuestions();
      setQuestionList((prev) => [...prev, res.question || question]); // res.question if backend returns created object

      // Reset form
      setQuestion({
        questionText: "",
        topic: "",
        difficulty: "",
        marks: 0,
        questionType: "",
        options: ["", ""],
        correctOptionIndex: null,
        correctOptionIndexes: [],
        correctIntegerAnswer: null,
        correctAnswer: "",
      });
      setShowPreview(false);
      if (isSuccess) {
        toast.message("Question created successfully");
      } else if (isError) {
        toast.error("Error creating question, Try Again");
      }
    } catch (err) {
      console.error("Error saving question", err);
      // Optional: show toast or error message to user
    }
  };

  const renderQuestionComponent = () => {
    switch (question.questionType) {
      case "SingleCorrect":
        return (
          <SingleCorrectQuestion question={question} onChange={handleChange} />
        );
      case "MultiCorrect":
        return (
          <MultiCorrectQuestion question={question} onChange={handleChange} />
        );
      case "TrueFalse":
        return (
          <TrueFalseQuestion question={question} onChange={handleChange} />
        );
      case "ShortAnswer":
        return (
          <ShortAnswerQuestion question={question} onChange={handleChange} />
        );
      case "Integer":
        return <IntegerQuestion question={question} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create a Question</h1>
          <Button
            onClick={() => setMcqAI((prev) => !prev)}
            className="bg-[#0B0E1C] text-white hover:bg-[#1a1f35] gap-2"
          >
            Generate With AI
            <Sparkles className="h-4 w-4 text-purple-400" />
          </Button>
        </div>

        {mcqAI ? (
          <>
          <CreateMcqAI
            open={mcqAI}
            onClose={() => setMcqAI(false)}
            onDataGenerated={handleGeneratedData}
          />
          {renderQuestionComponent()}</>
        ) : (
          <>
            {/* Common metadata form */}
            <QuestionForm question={question} onChange={handleChange} />

            {/* Type-specific form */}
            {renderQuestionComponent()}
          </>
        )}
        <div className="flex space-x-1">
          <QuestionPreview
            open={showPreview}
            onOpenChange={setShowPreview}
            question={question}
          />
          <Button onClick={() => setShowPreview(true)} className="w-full mt-6">
            Preview Question
          </Button>
          <Button onClick={handleSubmit} className="w-full mt-6">
            Save Question
          </Button>
          {showPreview && <QuestionPreview question={question} />}
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl space-y-6 my-2">
        <QuestionList
          questions={getQuesByAssIdData?.assessment?.questions || []}
          setQuestions={setQuestionList}
        />
      </div>
    </>
  );
}
