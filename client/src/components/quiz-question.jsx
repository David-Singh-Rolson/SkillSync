"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "./ui/input"

export function QuizQuestion({ question, answers, onSingleAnswer, onMultipleAnswer, onTrueFalseAnswer,onIntegerAnswer,onShortAnswer }) {
  const questionId = question._id

  switch (question.questionType) {
    case "SingleCorrect":
      return (
        <RadioGroup
          value={(answers[questionId]?.response?.[0] ?? "").toString()}
          onValueChange={(value) => onSingleAnswer(questionId,Number.parseInt(value))}
          className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                answers[questionId]?.response?.[0] === index ? "border-primary bg-primary/5" : ""
              }`}>
              <RadioGroupItem value={index.toString()} id={`option-${questionId}-${index}`} />
              <Label
                htmlFor={`option-${questionId}-${index}`}
                className="flex-1 cursor-pointer font-medium">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );

    case "MultiCorrect":
      return (
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const currentAnswers = answers[questionId]?.response || []
            return (
              <div
                key={index}
                className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                  currentAnswers.includes(index) ? "border-primary bg-primary/5" : ""
                }`}>
                <Checkbox
                  id={`option-${questionId}-${index}`}
                  checked={currentAnswers.includes(index)}
                  onCheckedChange={() => onMultipleAnswer(questionId,index)} />
                <Label
                  htmlFor={`option-${questionId}-${index}`}
                  className="flex-1 cursor-pointer font-medium">
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
      );

    case "TrueFalse":
      return (
        <RadioGroup
          value={answers[questionId] !== undefined ? (answers[questionId]?.response[0] === 0 ? "true" : "false") : ""}
          onValueChange={(value)=>onTrueFalseAnswer(questionId,value)}
          className="space-y-3">
          <div
            className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
              answers[questionId]?.response?.[0] === 0 ? "border-primary bg-primary/5" : ""
            }`}>
            <RadioGroupItem value="true" id={`true-${questionId}`} />
            <Label
              htmlFor={`true-${questionId}`}
              className="flex-1 cursor-pointer font-medium">
              True
            </Label>
          </div>
          <div
            className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
              answers[questionId]?.response?.[0] === 1 ? "border-primary bg-primary/5" : ""
            }`}>
            <RadioGroupItem value="false" id={`false-${questionId}`} />
            <Label
              htmlFor={`false-${questionId}`}
              className="flex-1 cursor-pointer font-medium">
              False
            </Label>
          </div>
        </RadioGroup>
      );
    
    case "Integer":
            return (
              <div className="space-y-4">
                <Label htmlFor="integer-answer" className="text-base font-medium">
                  Enter your answer (integer only):
                </Label>
                <div className="rounded-lg border p-4">
                  <Input
                    id="integer-answer"
                    type="number"
                    value={(answers[questionId]?.response)?.toString() || ""}
                    onChange={(e)=>onIntegerAnswer(e,questionId)}
                    className="max-w-xs"
                    placeholder="Enter a number" />
                </div>
              </div>
            );
    
    case "ShortAnswer":
            return (
              <div className="space-y-4">
                <Label htmlFor="integer-answer" className="text-base font-medium">
                  Enter your answer :
                </Label>
                <div className="rounded-lg border p-4">
                  <Input
                    id="short-answer"
                    type="text"
                    value={(answers[questionId]?.response) || ""}
                    onChange={(e)=>onShortAnswer(e,questionId)}
                    className="max-w-xs"
                    placeholder="Enter Your Answer" />
                </div>
              </div>
            );
    
    default:
      return <div>Unknown question type</div>;
  }
}
