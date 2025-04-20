import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function IntegerQuestion({ question, onChange }) {
  return (
    <div>
      <Label>Correct Integer Answer</Label>
      <Input
        type="number"
        value={question.correctOptionIndex}
        onChange={(e) => onChange("correctOptionIndex", parseInt(e.target.value))}
        placeholder="Enter integer value"
      />
    </div>
  );
}
