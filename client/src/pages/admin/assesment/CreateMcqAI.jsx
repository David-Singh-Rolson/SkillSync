import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { useGenerateMCQsMutation } from "@/features/api/mcqBuilderApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

const typeLabels = {
  SingleCorrect: "Multiple Choice (Single Correct)",
  MultiCorrect: "Multiple Choice (Multi Correct)",
  TrueFalse: "True/False",
  Integer: "Numerical Answer",
  ShortAnswer: "Short Answer",
};

const CreateMcqAI = ({ open, onClose, onDataGenerated }) => {
  const [quizConfig, setQuizConfig] = useState({
    topic: "",
    description: "",
    difficulty: "",
    questions: [],
  });

  const [
    generateMCQs,
    {
      data: mcqData,
      isError: mcqError,
      isLoading: mcqLoading,
      isSuccess: mcqSuccess,
    },
  ] = useGenerateMCQsMutation();
  const availableTypes = Object.keys(typeLabels).filter(
    (type) => !quizConfig.questions.some((q) => q.type === type)
  );

  //   useEffect(() => {
  //     if (mcqSuccess && mcqData) {
  //       onDataGenerated(mcqData);
  //     }
  //     else if(mcqLoading){
  //         <LoadingSpinner/>
  //     }
  //   }, [mcqSuccess]);

  // useEffect(() => {
  //     if (mcqLoading) {
  //       toast.info("Generating quiz. Please wait...");
  //     }

  //     if (mcqSuccess && mcqData) {
  //         onDataGenerated(mcqData);
  //         toast.success("Quiz generated successfully!");
  //     }

  //     if (mcqError) {
  //       toast.error("Failed to generate quiz. Please try again.");
  //     }
  //   }, [mcqSuccess, mcqData, mcqLoading, mcqError]);

  useEffect(() => {
    let toastId = null;

    if (mcqLoading) {
      toastId = toast.loading("Generating question. Please wait...");
    }

    if (mcqSuccess && mcqData) {
      toast.success("Question generated successfully!");
    }

    if (mcqError) {
      toast.error("Failed to generate question. Please try again.");
    }

    return () => {
      if (toastId) toast.dismiss(toastId);
    };
  }, [mcqSuccess, mcqData, mcqLoading, mcqError]);

  const handleGenerate = () => {
    const formattedConfig = {
      topic: quizConfig.topic,
      description: quizConfig.description,
      difficulty: quizConfig.difficulty,
      number_of_questions: Object.fromEntries(
        quizConfig.questions.map((q) => [q.type, q.count])
      ),
    };
    // console.log("Generating quiz with config:", formattedConfig);
    // Here you would typically call an API to generate the quiz
    generateMCQs(formattedConfig);
  };

  const handleSubmit = () => {
    onDataGenerated(mcqData);
    onClose();
  };

  const addQuestionType = (type) => {
    setQuizConfig((prev) => ({
      ...prev,
      questions: [...prev.questions, { type, count: 1 }],
    }));
  };

  const removeQuestionType = (index) => {
    setQuizConfig((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestionCount = (index, count) => {
    setQuizConfig((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, count } : q
      ),
    }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose(); // call parent's onClose when dialog closes
      }}
    >
      {/* <DialogTrigger asChild>{onClose}</DialogTrigger> */}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Configure Quiz Generation
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={quizConfig.topic}
              onChange={(e) =>
                setQuizConfig({ ...quizConfig, topic: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={quizConfig.description}
              onChange={(e) =>
                setQuizConfig({ ...quizConfig, description: e.target.value })
              }
              placeholder="Add specific topics or concepts to include"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={quizConfig.difficulty}
              onValueChange={(value) =>
                setQuizConfig({ ...quizConfig, difficulty: value })
              }
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Question Types</Label>
              {availableTypes.length > 0 && (
                <Select onValueChange={addQuestionType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add question type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {typeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Card className="p-4">
              {quizConfig.questions.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No question types selected. Add a question type to continue.
                </div>
              ) : (
                <div className="space-y-4">
                  {quizConfig.questions.map((question, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {typeLabels[question.type]}
                        </p>
                      </div>
                      <Select
                        value={question.count.toString()}
                        onValueChange={(value) =>
                          updateQuestionCount(index, parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Count" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 11 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestionType(index)}
                        aria-label={`Remove ${question.type}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div> */}
          <div className="grid gap-2">
  <div className="flex items-center justify-between">
    <Label>Question Type</Label>
    {quizConfig.questions.length === 0 ? (
      <Select onValueChange={addQuestionType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select question type" />
        </SelectTrigger>
        <SelectContent>
          {availableTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {typeLabels[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <span className="text-sm text-muted-foreground">
        Only one type can be added at a time
      </span>
    )}
  </div>

  <Card className="p-4">
    {quizConfig.questions.length === 0 ? (
      <div className="text-center py-4 text-muted-foreground">
        No question type selected. Add one to continue.
      </div>
    ) : (
      <div className="space-y-4">
        {quizConfig.questions.map((question, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{typeLabels[question.type]}</p>
            </div>
            <Select
              value={question.count.toString()}
              onValueChange={(value) => updateQuestionCount(index, parseInt(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Count" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 11 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeQuestionType(index)}
              aria-label={`Remove ${question.type}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    )}
  </Card>
</div>


          <div className="mt-2">
            <h3 className="text-sm font-medium mb-2">JSON Output Preview:</h3>
            <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
              {JSON.stringify(mcqData, null, 2)}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={quizConfig.questions.length === 0}
          >
            Generate Question
          </Button>
          <Button onClick={handleSubmit} variant="destructive">
            Submit Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateMcqAI;
