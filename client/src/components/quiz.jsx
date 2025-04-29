"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Maximize,
  Minimize,
} from "lucide-react";
import { QuizQuestion } from "./quiz-question";
import { QuestionNavigator } from "./question-navigator";
import { QuizHeader } from "./quiz-header";
import { QuizResults } from "./quiz-results";
import { useFullscreen } from "../hooks/use-fullscreen";
import { useSubmitTestAttemptMutation } from "@/features/api/testAttemptApi";
// import { questions } from "../../data/questions"

export default function Quiz({ quizData }) {
  console.log("quiz", quizData);
  if (!quizData || quizData.length === 0) {
    return <Loader2 />;
  }
  const attemptId = quizData?.attemptId;
  const testType="Topic"

  const questions = quizData?.questions;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(); // 30 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showFsWarning, setShowFsWarning] = useState(false);
  const { isFullscreen, toggleFullscreen, enterFullscreen } = useFullscreen();
  const [
    submitTestAttempt,
    {
      data: submitTestData,
      isLoading: submitTestLoading,
      isSuccess: submitTestSuccess,
    },
  ] = useSubmitTestAttemptMutation();

  // Enter fullscreen when component mounts
  useEffect(() => {
    // Enter fullscreen & start timer once
    enterFullscreen();
    setTimeRemaining(quizData.timeLimit * 60);

    // Listen for exit from fullscreen
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        // pause timer
        setIsTimerRunning(false);
        // show our overlay
        setShowFsWarning(true);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);
  

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerRunning && !showResults) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, showResults]);
  if (showFsWarning) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
          <h2 className="mb-4 text-xl font-semibold">Please stay in fullscreen</h2>
          <p className="mb-6">Click below to return to fullscreen and resume your test.</p>
          <Button
            onClick={() => {
              enterFullscreen();
              setShowFsWarning(false);
              setIsTimerRunning(true);
            }}
          >
            Return to Fullscreen
          </Button>
        </div>
      </div>
    );
  }
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSingleAnswer = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: {
        questionType: "SingleCorrect", // store the type
        response: [optionIndex], // store the selected answer(s)
      },
    });
  };

  const handleMultipleAnswer = (questionId, optionIndex) => {
    setAnswers((prevAnswers) => {
      // Get the current answers for this specific question or an empty array if not yet answered
      const currentAnswers = prevAnswers[questionId]?.response || [];

      // Determine if the option is already selected
      const updatedAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter((idx) => idx !== optionIndex) // Remove the option if it was already selected
        : [...currentAnswers, optionIndex]; // Add the option if it's not selected

      // Return the updated state while keeping other question's answers intact
      return {
        ...prevAnswers,
        [questionId]: {
          questionType: "MultiCorrect",
          response: updatedAnswers,
        }, // Update only the answer for the current question
      };
    });
  };

  const handleIntegerAnswer = (e, questionId) => {
    const value = e.target.value; // Get the input value
    const numValue = Number.parseInt(value); // Try to parse it as an integer

    if (!isNaN(numValue)) {
      // If the value is a valid integer, store it in the state
      setAnswers({
        ...answers,
        [questionId]: { questionType: "Integer", response: numValue },
      });
    } else {
      // If the value is not a valid number, clear the answer
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: { questionType: "Integer", response: "" }, // keep structure same
      }));
    }
  };

  const handleTrueFalseAnswer = (questionId, value) => {
    const optionIndex = value === "true" ? 0 : 1;

    // Update the answers state for the current question while preserving other answers
    setAnswers((prevAnswers) => ({
      ...prevAnswers, // Spread the previous answers to keep other question answers
      [questionId]: { questionType: "TrueFalse", response: [optionIndex] }, // Update the answer for the current question
    }));
  };

  const handleShortAnswer = (e) => {
    const value = e.target.value;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questions[currentQuestion]._id]: {
        questionType: "ShortAnswer",
        response: value,
      },
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    setIsTimerRunning(false);
    submitTestAttempt({ attemptId, responses: answers,testType });
    console.log("Submitting answers:", answers);
  };

  const handleRestartQuiz = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeRemaining(1800);
    setIsTimerRunning(true);
  };

  if (showResults) {
    return (
      <QuizResults
        totalAnswered={Object.keys(answers).length}
        totalQuestions={questions.length}
        finalAnswers={answers}
        onRestartQuiz={handleRestartQuiz}
      />
    );
  }

  const isAnswered = answers[questions[currentQuestion]._id] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const totalAnswered = Object.keys(answers).length;
  const allQuestionsAnswered = totalAnswered === questions.length;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4 relative">
      <Button
        variant="outline"
        size="icon"
        className="absolute top-0 right-0 z-10"
        onClick={toggleFullscreen}
      >
        {isFullscreen ? (
          <Minimize className="h-4 w-4" />
        ) : (
          <Maximize className="h-4 w-4" />
        )}
      </Button>
      <div className="w-full md:w-3/4">
        <Card className="w-full shadow-lg">
          <CardHeader className="border-b">
            <QuizHeader
              currentQuestion={currentQuestion}
              totalQuestions={questions.length}
              totalAnswered={totalAnswered}
              timeRemaining={timeRemaining}
              question={questions[currentQuestion]}
              formatTime={formatTime}
            />
          </CardHeader>
          <CardContent className="pt-6">
            <QuizQuestion
              question={questions[currentQuestion]}
              answers={answers}
              onSingleAnswer={handleSingleAnswer}
              onMultipleAnswer={handleMultipleAnswer}
              onIntegerAnswer={handleIntegerAnswer}
              onTrueFalseAnswer={handleTrueFalseAnswer}
              onShortAnswer={handleShortAnswer}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <div className="flex gap-2">
              {!isLastQuestion && (
                <Button
                  onClick={nextQuestion}
                  disabled={!isAnswered}
                  className="flex items-center gap-1"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="w-full md:w-1/4">
        <QuestionNavigator
          questions={questions}
          currentQuestion={currentQuestion}
          answers={answers}
          onQuestionSelect={setCurrentQuestion}
          onSubmitQuiz={handleSubmitQuiz}
          allQuestionsAnswered={allQuestionsAnswered}
        />
      </div>
    </div>
  );
}
