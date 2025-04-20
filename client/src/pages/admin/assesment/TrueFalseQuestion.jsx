import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function TrueFalseQuestion({ question, onChange }) {
  return (
    <div>
      <Label>Correct Answer</Label>
      <select
        className="w-full p-2 border rounded"
        value={question.correctOptionIndex}
        onChange={(e) => onChange("correctOptionIndex", parseInt(e.target.value))}
      >
        <option value={0}>True</option>
        <option value={1}>False</option>
      </select>
    </div>
  );
}
