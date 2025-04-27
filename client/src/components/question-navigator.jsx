import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function QuestionNavigator({
  questions,
  currentQuestion,
  answers,
  onQuestionSelect,
  onSubmitQuiz,
  allQuestionsAnswered,
}) {
  // Group questions by topic
  const questionsByTopic = {}

  questions.forEach((question, index) => {
    if (!questionsByTopic[question.topic]) {
      questionsByTopic[question.topic] = []
    }
    questionsByTopic[question.topic].push({ index, question })
  })

  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="border-b bg-primary/5">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Question Navigator</span>
          <span className="text-sm font-normal">
            {Object.keys(answers).length}/{questions.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] md:h-[500px]">
          <div className="p-4 space-y-4">
            {Object.entries(questionsByTopic).map(([topic, questionGroup]) => (
              <div key={topic} className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground px-2">{topic}</h3>
                <div className="grid grid-cols-5 gap-2">
                  {questionGroup.map(({ index, question }) => {
                    const isAnswered = answers[question._id] !== undefined
                    const isCurrent = index === currentQuestion

                    return (
                      <Button
                        key={index}
                        variant={isCurrent ? "default" : isAnswered ? "outline" : "ghost"}
                        className={cn(
                          "h-10 w-10 p-0 relative",
                          isCurrent && "ring-2 ring-offset-2",
                          isAnswered && !isCurrent && "bg-gray-100",
                          question.difficulty === "Easy" && "border-green-500",
                          question.difficulty === "Medium" && "border-yellow-500",
                          question.difficulty === "Hard" && "border-red-500"
                        )}
                        onClick={() => onQuestionSelect(index)}>
                        {index + 1}
                        {isAnswered && (
                          <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3 h-3"></span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t bg-primary/5">
        <Button
          onClick={onSubmitQuiz}
          disabled={!allQuestionsAnswered}
          className="w-full flex items-center justify-center gap-1">
          <CheckCircle className="h-4 w-4" /> Submit Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
