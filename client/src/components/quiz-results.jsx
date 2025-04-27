import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function QuizResults({ totalAnswered, totalQuestions, finalAnswers, onRestartQuiz }) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-2xl text-center">Quiz Submitted</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center justify-center p-4 bg-green-100 text-green-800 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <p className="text-xl font-semibold">Your answers have been submitted successfully!</p>
          <p className="text-md">
            You answered {totalAnswered} out of {totalQuestions} questions.
          </p>
        </div>

        <div className="border p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Response Data:</h3>
          <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">{JSON.stringify(finalAnswers, null, 2)}</pre>
        </div>
      </CardContent>
      <CardFooter className="bg-primary/5">
        <Button onClick={onRestartQuiz} className="w-full">
          Start New Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
