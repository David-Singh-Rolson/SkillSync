import { Trash2 } from "lucide-react";

export default function MultiCorrectQuestion({ question, onChange }) {
    const handleOptionChange = (index, value) => {
      const newOptions = [...question.options];
      newOptions[index] = value;
      onChange("options", newOptions);
    };
  
    const addOption = () => {
      onChange("options", [...question.options, ""]);
    };
  
    const removeOption = (index) => {
      const newOptions = question.options.filter((_, i) => i !== index);
      onChange("options", newOptions);
  
      // Adjust correctOptionIndexes when an option is removed
      const newCorrectIndexes = (question.correctOptionIndexes || [])
        .filter((i) => i !== index) // Remove the deleted index
        .map((i) => (i > index ? i - 1 : i)); // Shift indices after the deleted one
      onChange("correctOptionIndexes", newCorrectIndexes);
    };
  
    const toggleCorrect = (index) => {
      let current = question.correctOptionIndexes || [];
      if (current.includes(index)) {
        current = current.filter((i) => i !== index);
      } else {
        current = [...current, index];
      }
      onChange("correctOptionIndexes", current);
    };
  
    return (
      <div className="space-y-2">
        {question.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {/* Multi-select checkbox for marking as correct */}
            <input
              type="checkbox"
              checked={question.correctOptionIndexes?.includes(idx)}
              onChange={() => toggleCorrect(idx)}
            />
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              className="border px-2 py-1 rounded w-full"
            />
            <button
              type="button"
              onClick={() => removeOption(idx)}
              className="text-red-500"
            >
              <Trash2/>
            </button>
          </div>
        ))}
  
        <button
          type="button"
          onClick={addOption}
          className="text-blue-600 underline"
        >
          + Add Option
        </button>
      </div>
    );
  }
  