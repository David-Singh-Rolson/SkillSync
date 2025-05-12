"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Calendar, BookOpen, BarChart } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function RecentTests({ student }) {
  const [expandedTest, setExpandedTest] = useState(null)

  // In a real application, you would have multiple test attempts
  // For this example, we'll create some mock data based on the single test we have
  const recentTests = [
    {
      id: student._id,
      date: new Date(student.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      topic: student.testType,
      level: student.testLevel,
      score: student.score,
      totalMarks: student.totalMarks,
      percentage: student.percentage,
      status: student.status,
      topicWisePerformance: student.topicWisePerformance,
    },
    {
      id: "prev-test-1",
      date: "April 30, 2025",
      topic: "DBMS",
      level: "Easy",
      score: 18,
      totalMarks: 20,
      percentage: 90,
      status: "Completed",
      topicWisePerformance: {
        DBMS: 0.9,
      },
    },
    {
      id: "prev-test-2",
      date: "April 20, 2025",
      topic: "DBMS",
      level: "Easy",
      score: 12,
      totalMarks: 20,
      percentage: 60,
      status: "Completed",
      topicWisePerformance: {
        DBMS: 0.6,
      },
    },
  ]

  const toggleExpand = (id) => {
    if (expandedTest === id) {
      setExpandedTest(null)
    } else {
      setExpandedTest(id)
    }
  }

  const getBadgeVariant = (percentage) => {
    if (percentage >= 80) return "success"
    if (percentage >= 60) return "default"
    if (percentage >= 40) return "secondary"
    return "destructive"
  }

  return (
    <Card className="col-span-1 transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Recent Tests</CardTitle>
        <CardDescription>Latest test attempts</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-4">
            {recentTests.map((test) => (
              <div
                key={test.id}
                className={`flex flex-col space-y-2 p-4 border rounded-lg transition-all duration-200 ${
                  expandedTest === test.id ? "bg-gray-50 dark:bg-gray-800" : ""
                } hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer`}
                onClick={() => toggleExpand(test.id)}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{test.topic} Test</h3>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant={getBadgeVariant(test.percentage)}>{test.percentage}%</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {test.percentage >= 80
                          ? "Excellent performance!"
                          : test.percentage >= 60
                            ? "Good performance"
                            : test.percentage >= 40
                              ? "Average performance"
                              : "Needs improvement"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {test.date} • {test.level} • {test.score}/{test.totalMarks} marks
                </div>

                {expandedTest === test.id && (
                  <div className="mt-2 pt-2 border-t">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <BarChart className="h-3 w-3" /> Topic Performance
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(test.topicWisePerformance || {}).map(([topic, score]) => (
                        <div key={topic} className="flex items-center justify-between text-sm">
                          <span>{topic}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  score * 100 >= 70
                                    ? "bg-green-500"
                                    : score * 100 >= 40
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${score * 100}%` }}></div>
                            </div>
                            <span>{(score * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Status: {test.status}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">ID: {test.id.substring(0, 8)}...</span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${expandedTest === test.id ? "rotate-90" : ""}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
