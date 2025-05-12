"use client"

import { useEffect, useState } from "react"
import { PerformanceOverview } from "./performance-overview"
import { TopicPerformance } from "./topic-performance"
import { DifficultyLevelStats } from "./difficulty-level-stats"
import { TestHistoryChart } from "./test-history-chart"
import { RecentTests } from "./recent-tests"

import { Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useSelector } from "react-redux";
import { useGetLatestTestResultMutation } from "@/features/api/performanceApi"
export function StudentDashboard() {
    const userId = useSelector((state) => state.auth.user?._id);
  
  const [getLatestTestResult,{data,isLoading,isSuccess,isError}]=useGetLatestTestResultMutation()
  useEffect(() => {
 getLatestTestResult(userId)

  }, [])
  
  const studentData = {
    _id: "681c7eb5433399fe0f6700ce",
    student: "681652ae2fdba37dacb03f64",
    test: "6816f717d763eff485d04801",
    responses: [
      {
        question: "681729f0dfb1a16336e938d0",
        selectedOptionIndex: 0,
        selectedOptionIndexes: [],
        isCorrect: false,
        quesLevel: "Easy",
        topic: "DBMS",
        marksAwarded: 0,
        _id: "681c7f85da586ee2c044ed31",
      },
      // Other responses would be here
    ],
    totalMarks: 20,
    score: 0,
    avgTopicDifficulty: 0,
    status: "Submitted",
    topicWisePerformance: {
      DBMS: 0,
      "Data Structures": 0.4,
      Algorithms: 0.6,
      "Operating Systems": 0.3,
    },
    avgQuestionDifficulty: 1,
    avgPreviousPerformance: "20",
    labelCourseId: "681651432fdba37dacb03f4b",
    testType: "Topic",
    testLevel: "Medium",
    createdAt: "2025-05-08T09:51:49.854+00:00",
    updatedAt: "2025-05-08T09:55:17.679+00:00",
    __v: 1,
    overallAccuracy: 0,
    percentage: 0,
    performanceTrend: "Stable",
    questionLevelStats: {
      easy: {
        attempted: 5,
        correct: 1,
        accuracy: 0.2,
      },
      medium: {
        attempted: 3,
        correct: 2,
        accuracy: 0.67,
      },
      hard: {
        attempted: 2,
        correct: 0,
        accuracy: 0,
      },
    },
  }
  const [activeTab, setActiveTab] = useState("overview")

  // In a real application, you would fetch this data from an API
  const student = studentData

  // Determine trend icon based on performance trend
  const getTrendIcon = (trend) => {
    switch (trend) {
      case "Improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "Declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "Stable":
        return <Minus className="h-4 w-4 text-yellow-500" />;
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Student Performance Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive analytics and insights for student ID: {student._id}</p>
      </div>
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
          <TabsTrigger value="history">Test History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card
                    className="transition-all duration-200 hover:shadow-md hover:border-primary/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        {student.score}/{student.totalMarks}
                        {student.score / student.totalMarks > 0.7 ? (
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground">{student.percentage}% overall</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total points scored in the latest test</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {student.score / student.totalMarks >= 0.7
                      ? "Great performance!"
                      : student.score / student.totalMarks >= 0.4
                        ? "Average performance"
                        : "Needs improvement"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card
                    className="transition-all duration-200 hover:shadow-md hover:border-primary/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold flex items-center gap-2">
                        {student.overallAccuracy * 100}%
                        <span className="flex items-center">{getTrendIcon(student.performanceTrend)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{student.performanceTrend} trend</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Percentage of correct answers across all questions</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {student.performanceTrend === "Improving"
                      ? "Keep up the good work!"
                      : student.performanceTrend === "Declining"
                        ? "Focus on improving your accuracy"
                        : "Maintain consistent performance"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card
                    className="transition-all duration-200 hover:shadow-md hover:border-primary/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Test Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{student.testLevel}</div>
                      <p className="text-xs text-muted-foreground">Avg. difficulty: {student.avgQuestionDifficulty}</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Difficulty level of the latest test</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average question difficulty: {student.avgQuestionDifficulty}/3
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card
                    className="transition-all duration-200 hover:shadow-md hover:border-primary/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Previous Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{student.avgPreviousPerformance}%</div>
                      <p className="text-xs text-muted-foreground">From previous tests</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Average score from all previous test attempts</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Number(student.avgPreviousPerformance) > Number(student.percentage)
                      ? "Current performance is below your average"
                      : "Current performance is above your average"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerformanceOverview student={student} />
            <RecentTests student={student} />
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <TopicPerformance student={student} />
        </TabsContent>

        <TabsContent value="difficulty" className="space-y-4">
          <DifficultyLevelStats student={student} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <TestHistoryChart student={student} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
