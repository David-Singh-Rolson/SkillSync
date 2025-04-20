import { DeleteIcon, Trash2 } from "lucide-react";

export default function SingleCorrectQuestion({ question, onChange }) {
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
      if (index === question.correctOptionIndex) {
        onChange("correctOptionIndex", null);
      }
    };
  
    const handleCorrectSelect = (index) => {
      onChange("correctOptionIndex", index);
    };
  
    return (
      <div className="space-y-2">
        {question.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="radio"
              name="single-correct"
              checked={question.correctOptionIndex === idx}
              onChange={() => handleCorrectSelect(idx)}
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
  