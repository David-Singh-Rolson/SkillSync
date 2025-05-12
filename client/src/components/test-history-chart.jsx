import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export function TestHistoryChart({ student }) {
  // In a real application, you would have multiple test attempts
  // For this example, we'll create some mock data based on the single test we have
  const testHistory = [
    { id: 1, date: "2025-04-10", score: 15, percentage: 75 },
    { id: 2, date: "2025-04-20", score: 12, percentage: 60 },
    { id: 3, date: "2025-04-30", score: 18, percentage: 90 },
    { id: 4, date: "2025-05-08", score: student.score, percentage: student.percentage },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test History</CardTitle>
        <CardDescription>Performance trend over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={{
              percentage: {
                label: "Percentage",
                color: "hsl(var(--chart-1))",
              },
            }}>
            <LineChart
              data={testHistory}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 30,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                } />
              <YAxis
                domain={[0, 100]}
                label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                formatter={(value, name) => [`${value}%`, "Score"]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                } />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="var(--color-percentage)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }} />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
