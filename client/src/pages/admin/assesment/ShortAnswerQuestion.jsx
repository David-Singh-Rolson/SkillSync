import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ShortAnswerQuestion({ question, onChange }) {
  return (
    <div>
      <Label>Correct Answer</Label>
      <Input
        value={question.correctAnswer}
        onChange={(e) => onChange("correctAnswer", e.target.value)}
        placeholder="Enter correct short answer"
      />
    </div>
  );
}
