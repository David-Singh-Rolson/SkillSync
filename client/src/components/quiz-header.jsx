"use client"

import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

export function QuizHeader({ currentQuestion, totalQuestions, totalAnswered, timeRemaining, question, formatTime }) {
  const renderQuestionType = (type) => {
    switch (type) {
      case "SingleCorrect":
        return "Single Choice"
      case "MultiCorrect":
        return "Multiple Choice"
      case "TrueFalse":
        return "True/False"
       case "Integer":
        return "Integer Answer"
       case "ShortAnswer":
        return "Short Answer"
      default:
        return type
    }
  }

  const difficultyColor =
    {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Hard: "bg-red-100 text-red-800",
    }[question.difficulty] || "bg-gray-100 text-gray-800"

  return (
    <>
      <div className="flex justify-end items-center mb-4">
        <div
          className="flex items-center gap-1 text-sm font-medium px-3 py-1 bg-primary/10 rounded-full">
          <Clock className="h-4 w-4" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span>
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span className="text-sm font-normal text-muted-foreground">
          {totalAnswered} of {totalQuestions} answered
        </span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-full">
          {renderQuestionType(question.questionType)}
        </div>
        <div className="text-sm font-medium">
          {question.questionType === "MultiCorrect" ? "(Select all that apply)" : ""}
        </div>
      </div>
      <Progress
        value={((currentQuestion + 1) / totalQuestions) * 100}
        className="h-2 mt-4" />
      <div className="text-xl font-semibold mt-4">{question.questionText}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Topic: {question.topic}</span>
        <span className={`text-xs px-2 py-1 ${difficultyColor} rounded-full`}>Difficulty: {question.difficulty}</span>
        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">Marks: {question.marks}</span>
      </div>
    </>
  );
}
