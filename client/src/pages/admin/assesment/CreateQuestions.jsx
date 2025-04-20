import { useState } from "react";
import QuestionForm from "./QuestionForm";
import SingleCorrectQuestion from "./SingleCorrectQuestion";
import MultiCorrectQuestion from "./MultiCorrectQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import ShortAnswerQuestion from "./ShortAnswerQuestion";
import IntegerQuestion from "./IntegerQuestion";
import { Button } from "@/components/ui/button";
import QuestionPreview from "./QuestionPreview";
import QuestionList from "./QuestionList";
import { useAddQuestionMutation } from "@/features/api/questionApi";
import { toast } from "sonner";
export default function CreateQuestions() {
  const [question, setQuestion] = useState({
    questionText: "",
    topic: "",
    difficulty: "",
    marks: 0,
    questionType: "",
    options: ["", ""],
    correctOptionIndex: null,
    correctOptionIndexes: [],
    correctAnswer: null,
    answer: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [questionList, setQuestionList] = useState([]);
const [addQuestion,{data,isLoading,isSuccess,isError}]=useAddQuestionMutation()

  const handleChange = (field, value) => {
    setQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await addQuestion(question).unwrap(); // unwrap to handle success/failure properly
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
        correctAnswer: null,
        answer: "",
      });
      setShowPreview(false);
      if (isSuccess) {
        toast.message("Question created successfully")
      }
      else if(isError){
        toast.error("Error creating question, Try Again")
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
      <h1 className="text-2xl font-bold">Create a Question</h1>

      {/* Common metadata form */}
      <QuestionForm question={question} onChange={handleChange} />

      {/* Type-specific form */}
      {renderQuestionComponent()}

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

      <QuestionList questions={questionList} setQuestions={setQuestionList}/>
    </div>
      </>
  );
}
