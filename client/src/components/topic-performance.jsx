import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export function TopicPerformance({ student }) {
  // Transform topic data for chart
  const topicData = Object.entries(student.topicWisePerformance || {}).map(([topic, score]) => ({
    topic,
    score: Number(score) * 100, // Convert to percentage
  }))

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Topic Performance</CardTitle>
        <CardDescription>Performance breakdown by topic</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={{
              score: {
                label: "Score (%)",
                color: "hsl(var(--chart-1))",
              },
            }}>
            <BarChart
              data={topicData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" angle={-45} textAnchor="end" height={60} tickMargin={20} />
              <YAxis label={{ value: "Score (%)", angle: -90, position: "insideLeft" }} />
              <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
              <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
