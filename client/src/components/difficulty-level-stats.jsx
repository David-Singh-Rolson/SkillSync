"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DifficultyLevelStats({ student }) {
  const { questionLevelStats } = student

  // Prepare data for each difficulty level
  const easyData = [
    {
      name: "Correct",
      value: questionLevelStats?.easy?.correct || 0,
      color: "hsl(143, 85%, 40%)",
    },
    {
      name: "Incorrect",
      value: (questionLevelStats?.easy?.attempted || 0) - (questionLevelStats?.easy?.correct || 0),
      color: "hsl(346, 87%, 60%)",
    },
  ]

  const mediumData = [
    {
      name: "Correct",
      value: questionLevelStats?.medium?.correct || 0,
      color: "hsl(143, 85%, 40%)",
    },
    {
      name: "Incorrect",
      value: (questionLevelStats?.medium?.attempted || 0) - (questionLevelStats?.medium?.correct || 0),
      color: "hsl(346, 87%, 60%)",
    },
  ]

  const hardData = [
    {
      name: "Correct",
      value: questionLevelStats?.hard?.correct || 0,
      color: "hsl(143, 85%, 40%)",
    },
    {
      name: "Incorrect",
      value: (questionLevelStats?.hard?.attempted || 0) - (questionLevelStats?.hard?.correct || 0),
      color: "hsl(346, 87%, 60%)",
    },
  ]

  // Calculate accuracy for each level
  const easyAccuracy = questionLevelStats?.easy?.accuracy || 0
  const mediumAccuracy = questionLevelStats?.medium?.accuracy || 0
  const hardAccuracy = questionLevelStats?.hard?.accuracy || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance by Difficulty Level</CardTitle>
        <CardDescription>Breakdown of performance across different question difficulty levels</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="easy">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="easy">Easy ({(easyAccuracy * 100).toFixed(0)}%)</TabsTrigger>
            <TabsTrigger value="medium">Medium ({(mediumAccuracy * 100).toFixed(0)}%)</TabsTrigger>
            <TabsTrigger value="hard">Hard ({(hardAccuracy * 100).toFixed(0)}%)</TabsTrigger>
          </TabsList>

          <TabsContent value="easy" className="mt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={easyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {easyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} questions`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Attempted: {questionLevelStats?.easy?.attempted || 0} questions | Accuracy:{" "}
                {(easyAccuracy * 100).toFixed(0)}%
              </p>
            </div>
          </TabsContent>

          <TabsContent value="medium" className="mt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mediumData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {mediumData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} questions`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Attempted: {questionLevelStats?.medium?.attempted || 0} questions | Accuracy:{" "}
                {(mediumAccuracy * 100).toFixed(0)}%
              </p>
            </div>
          </TabsContent>

          <TabsContent value="hard" className="mt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hardData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                    {hardData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} questions`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                Attempted: {questionLevelStats?.hard?.attempted || 0} questions | Accuracy:{" "}
                {(hardAccuracy * 100).toFixed(0)}%
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
