// src/components/questions/QuestionForm.jsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuestionForm({ question, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Question Type</Label>
        <Select value={question.questionType} onValueChange={(val) => onChange("questionType", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
            <SelectContent>
            <SelectItem value="SingleCorrect">Single Correct</SelectItem>
            <SelectItem value="MultiCorrect">Multi Correct</SelectItem>
            <SelectItem value="TrueFalse">True / False</SelectItem>
            <SelectItem value="ShortAnswer">Short Answer</SelectItem>
            <SelectItem value="Integer">Integer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Question Text</Label>
        <Textarea value={question.questionText} onChange={(e) => onChange("questionText", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label>Topic</Label>
          <Input value={question.topic} onChange={(e) => onChange("topic", e.target.value)} />
        </div>
        <div>
          <Label>Difficulty</Label>
          <Select value={question.difficulty} onValueChange={(val) => onChange("difficulty", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Marks</Label>
          <Input type="number" value={question.marks} onChange={(e) => onChange("marks", parseInt(e.target.value))} />
        </div>
      </div>
    </div>
  );
}
