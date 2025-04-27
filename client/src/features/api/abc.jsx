import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample questions
const questions = [
  {
    id: 1,
    type: "single",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    type: "multiple",
    question: "Which of the following are programming languages?",
    options: ["HTML", "Python", "Java", "CSS"],
    correctAnswer: ["Python", "Java"],
  },
  {
    id: 3,
    type: "truefalse",
    question: "The Earth is flat.",
    correctAnswer: false,
  },
  {
    id: 4,
    type: "integer",
    question: "How many days are there in a week?",
    correctAnswer: 7,
  },
  {
    id: 5,
    type: "single",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 6,
    type: "multiple",
    question: "Which of these are mammals?",
    options: ["Dolphin", "Shark", "Whale", "Octopus"],
    correctAnswer: ["Dolphin", "Whale"],
  },
  {
    id: 7,
    type: "truefalse",
    question: "Water boils at 100 degrees Celsius at sea level.",
    correctAnswer: true,
  },
  {
    id: 8,
    type: "integer",
    question: "How many sides does a hexagon have?",
    correctAnswer: 6,
  },
  {
    id: 9,
    type: "single",
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    id: 10,
    type: "multiple",
    question: "Which of these countries are in Europe?",
    options: ["Spain", "Brazil", "Germany", "Japan"],
    correctAnswer: ["Spain", "Germany"],
  },
  {
    id: 11,
    type: "truefalse",
    question: "The Great Wall of China is visible from space with the naked eye.",
    correctAnswer: false,
  },
  {
    id: 12,
    type: "integer",
    question: "What is the atomic number of oxygen?",
    correctAnswer: 8,
  },
  {
    id: 13,
    type: "single",
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Gold", "Aluminum", "Argon"],
    correctAnswer: "Gold",
  },
  {
    id: 14,
    type: "multiple",
    question: "Which of these are prime numbers?",
    options: ["2", "4", "7", "9"],
    correctAnswer: ["2", "7"],
  },
  {
    id: 15,
    type: "truefalse",
    question: "Sound travels faster in water than in air.",
    correctAnswer: true,
  },
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true)

  // Timer effect
  useState(() => {
    let timer
    if (isTimerRunning && !showResults) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsTimerRunning(false)
            setShowResults(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer);
  })

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const handleSingleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleMultipleAnswer = (value) => {
    const currentAnswers = (answers[currentQuestion]) || []
    const updatedAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter((item) => item !== value)
      : [...currentAnswers, value]
    setAnswers({ ...answers, [currentQuestion]: updatedAnswers })
  }

  const handleTrueFalseAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: value === "true" })
  }

  const handleIntegerAnswer = (value) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue)) {
      setAnswers({ ...answers, [currentQuestion]: numValue })
    } else {
      setAnswers({ ...answers, [currentQuestion]: "" })
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = () => {
    setShowResults(true)
    setIsTimerRunning(false)
  }

  const calculateScore = () => {
    let score = 0
    questions.forEach((question, index) => {
      const userAnswer = answers[index]
      const correctAnswer = question.correctAnswer

      if (question.type === "multiple") {
        // For multiple choice, check if arrays have the same elements
        const userArr = (userAnswer) || []
        const correctArr = correctAnswer
        if (userArr.length === correctArr.length && userArr.every((item) => correctArr.includes(item))) {
          score++
        }
      } else if (userAnswer === correctAnswer) {
        score++
      }
    })
    return score
  }

  const renderQuestionContent = () => {
    const question = questions[currentQuestion]

    switch (question.type) {
      case "single":
        return (
          <RadioGroup
            value={(answers[currentQuestion]) || ""}
            onValueChange={handleSingleAnswer}
            className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                  (answers[currentQuestion]) === option ? "border-primary bg-primary/5" : ""
                }`}>
                <RadioGroupItem value={option} id={`option-${currentQuestion}-${index}`} />
                <Label
                  htmlFor={`option-${currentQuestion}-${index}`}
                  className="flex-1 cursor-pointer font-medium">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => {
              const currentAnswers = (answers[currentQuestion]) || []
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                    currentAnswers.includes(option) ? "border-primary bg-primary/5" : ""
                  }`}>
                  <Checkbox
                    id={`option-${currentQuestion}-${index}`}
                    checked={currentAnswers.includes(option)}
                    onCheckedChange={() => handleMultipleAnswer(option)} />
                  <Label
                    htmlFor={`option-${currentQuestion}-${index}`}
                    className="flex-1 cursor-pointer font-medium">
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      case "truefalse":
        return (
          <RadioGroup
            value={answers[currentQuestion] !== undefined ? (answers[currentQuestion]).toString() : ""}
            onValueChange={handleTrueFalseAnswer}
            className="space-y-3">
            <div
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                answers[currentQuestion] === true ? "border-primary bg-primary/5" : ""
              }`}>
              <RadioGroupItem value="true" id={`true-${currentQuestion}`} />
              <Label
                htmlFor={`true-${currentQuestion}`}
                className="flex-1 cursor-pointer font-medium">
                True
              </Label>
            </div>
            <div
              className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                answers[currentQuestion] === false ? "border-primary bg-primary/5" : ""
              }`}>
              <RadioGroupItem value="false" id={`false-${currentQuestion}`} />
              <Label
                htmlFor={`false-${currentQuestion}`}
                className="flex-1 cursor-pointer font-medium">
                False
              </Label>
            </div>
          </RadioGroup>
        );

      case "integer":
        return (
          <div className="space-y-4">
            <Label htmlFor="integer-answer" className="text-base font-medium">
              Enter your answer (integer only):
            </Label>
            <div className="rounded-lg border p-4">
              <Input
                id="integer-answer"
                type="number"
                value={(answers[currentQuestion])?.toString() || ""}
                onChange={(e) => handleIntegerAnswer(e.target.value)}
                className="max-w-xs"
                placeholder="Enter a number" />
            </div>
          </div>
        );

      default:
        return <div>Unknown question type</div>;
    }
  }

  const renderQuestionType = (type) => {
    switch (type) {
      case "single":
        return "Single Choice"
      case "multiple":
        return "Multiple Choice"
      case "truefalse":
        return "True/False"
      case "integer":
        return "Integer Answer"
    }
  }

  const renderResults = () => {
    const score = calculateScore()
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold">
              {score} / {questions.length}
            </p>
            <p className="text-xl">{percentage}%</p>
            <Progress value={percentage} className="h-2 w-full max-w-md mx-auto" />
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers[index]
              const isCorrect =
                question.type === "multiple"
                  ? JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)
                  : userAnswer === question.correctAnswer

              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg",
                    isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  )}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Question {index + 1}: {renderQuestionType(question.type)}
                      </p>
                      <p className="mt-1">{question.question}</p>
                    </div>
                    <div
                      className={cn(
                        "rounded-full p-1",
                        isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                      {isCorrect ? <CheckCircle size={16} /> : "✗"}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Your answer:</p>
                    <p className="text-sm">
                      {question.type === "multiple"
                        ? (userAnswer)?.join(", ") || "No answer"
                        : question.type === "truefalse"
                          ? userAnswer === true
                            ? "True"
                            : userAnswer === false
                              ? "False"
                              : "No answer"
                          : userAnswer?.toString() || "No answer"}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Correct answer:</p>
                    <p className="text-sm">
                      {question.type === "multiple"
                        ? (question.correctAnswer).join(", ")
                        : question.type === "truefalse"
                          ? question.correctAnswer === true
                            ? "True"
                            : "False"
                          : question.correctAnswer?.toString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              setShowResults(false)
              setCurrentQuestion(0)
              setAnswers({})
              setTimeRemaining(1800)
              setIsTimerRunning(true)
            }}
            className="w-full">
            Restart Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (showResults) {
    return renderResults();
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <span className="text-sm font-normal text-muted-foreground">
              {Object.keys(answers).length} of {questions.length} answered
            </span>
        <div className="flex items-center gap-1 text-sm font-medium">
          <Clock className="h-4 w-4" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 mb-6" />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-full">
              {renderQuestionType(questions[currentQuestion].type)}
            </div>
            <div className="text-sm font-medium">
              {questions[currentQuestion].type === "multiple" ? "(Select all that apply)" : ""}
            </div>
          </div>
          <CardTitle className="text-xl mt-2">{questions[currentQuestion].question}</CardTitle>
        </CardHeader>
        <CardContent>{renderQuestionContent()}</CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="flex gap-2">
            {currentQuestion === questions.length - 1 ? (
              <Button onClick={submitQuiz}>Submit Quiz</Button>
            ) : (
              <Button onClick={nextQuestion}  disabled={answers[currentQuestion] === undefined}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestion ? "default" : answers[index] !== undefined ? "outline" : "ghost"}
              className={cn(
                "h-10 w-10 p-0",
                index === currentQuestion && "ring-2 ring-offset-2",
                answers[index] !== undefined && index !== currentQuestion && "bg-gray-100",
              )}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}





export const submitTestAttempt = async (req, res) => {
  const difficultyMap = {
    easy: 1,
    medium: 2,
    hard: 3,
  };
  try {
    const { attemptId, responses } = req.body;

    if (!attemptId || !responses || typeof responses !== 'object') {
      return res.status(400).json({ message: "Invalid request data" });
    }
    console.log("responsessss",responses);
    
    const attempt = await TestAttempt.findById(attemptId).populate("test");
    
    if (!attempt) {
      return res.status(404).json({ message: "Test attempt not found" });
    }

    if (attempt.status === "Submitted") {
      return res.status(403).json({ message: "Test already submitted" });
    }

    
    // Convert responses object into an array
    // const responseArray = Object.entries(responses).map(([questionId, selectedOption]) => ({
    //   question: questionId,
    //   selectedOptionIndex: selectedOption,
    // }));
    
    // const questionIds = responseArray.map((r) => r.question);
    // const questions = await Question.find({ _id: { $in: questionIds } });
    
    // console.log("responseArray",responseArray);
    // let score = 0;
    // const topicScores = {};
    // const topicMarks = {};
    // let totalDifficulty = 0;
    // console.log("Mapping over responses:", responses);

    // const processedResponses = responseArray.map((response) => {
    //   const question = questions.find((q) => q._id.toString() === response.question);
    //   // console.warn("Question not found for response:", response);
    //   if (!question) return null;
      
      //
      // console.log("ques",question);

  //   const { isCorrect, marksAwarded } = evaluateAnswer(response, question);

  //     score += marksAwarded;

  //     // Track topic-wise performance
  //     if (!topicScores[question.topic]) {
  //       topicScores[question.topic] = 0;
  //       topicMarks[question.topic] = 0;
  //     }
  //     topicScores[question.topic] += marksAwarded;
  //     topicMarks[question.topic] += question.marks;

  //      // Map difficulty string to numeric value
  // const difficultyValue = difficultyMap[question.difficulty] || 0; // Default to 0 if difficulty is undefined or invalid

  // // Add to totalDifficulty
  // totalDifficulty += difficultyValue;
      // totalDifficulty += question.difficulty;

    //   return {
    //     question: question._id,
    //     selectedOptionIndex: response.selectedOptionIndex,
    //     isCorrect,
    //     topic: question.topic,
    //     marksAwarded,
    //   };
    // }).filter(Boolean);

    // // Calculate topic-wise percentage
    // const topicWisePerformance = {};
    // Object.keys(topicScores).forEach((topic) => {
    //   topicWisePerformance[topic] = Math.round((topicScores[topic] / topicMarks[topic]) * 100);
    // });

    // const percentage = Math.round((score / attempt.totalMarks) * 100);
    // const avgQuestionDifficulty = questions.length > 0 ? totalDifficulty / questions.length : 0; 

    // Update attempt
    attempt.responses = responses;
    // attempt.score = score;
    // attempt.percentage = percentage;
    attempt.status = "Submitted";
    // attempt.timeTaken = timeTaken;
    // attempt.topicWisePerformance = topicWisePerformance;
    // attempt.avgQuestionDifficulty = avgQuestionDifficulty;

    await attempt.save();

    return res.status(200).json({
      message: "Test submitted successfully",
      // score,
      // percentage,
      // topicWisePerformance,
    });
  } catch (error) {
    console.error("submitTestAttempt error:", error.message, error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};