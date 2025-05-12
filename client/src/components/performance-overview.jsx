import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts"

export function PerformanceOverview({ student }) {
  const [activeIndex, setActiveIndex] = useState(null)

  // Calculate correct and incorrect answers
  const correct = student.score
  const incorrect = student.totalMarks - student.score

  const data = [
    { name: "Correct", value: correct, color: "hsl(143, 85%, 40%)" },
    { name: "Incorrect", value: incorrect, color: "hsl(346, 87%, 60%)" },
  ]

  // Custom active shape for the pie chart
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

    return (
      <g>
        <text
          x={cx}
          y={cy - 20}
          dy={8}
          textAnchor="middle"
          fill={fill}
          className="text-lg font-semibold">
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 10}
          dy={8}
          textAnchor="middle"
          fill={fill}
          className="text-lg font-semibold">
          {value} questions
        </text>
        <text
          x={cx}
          y={cy + 30}
          dy={8}
          textAnchor="middle"
          fill={fill}
          className="text-sm">
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill} />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill} />
      </g>
    );
  }

  // Handle mouse enter event
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  // Handle mouse leave event
  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <Card className="col-span-1 transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Correct vs incorrect answers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} questions (${((value / student.totalMarks) * 100).toFixed(0)}%)`,
                  name,
                ]} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry) => <span style={{ color: entry.color, cursor: "pointer" }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm">
            {student.score === 0
              ? "You need to improve your performance. Try reviewing the material again."
              : student.score < student.totalMarks / 2
                ? "You're making progress, but there's room for improvement."
                : student.score < student.totalMarks * 0.7
                  ? "Good job! Keep practicing to improve further."
                  : "Excellent work! You've mastered this material."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
