import axios from "axios";

export const generateMcqWithAI = async (req, res) => {
  try {
    const { topic, description, difficulty, number_of_questions } = req.body;
// console.log("ai",req.body);

    const { data } = await axios.post("https://mcq-builder.binbard.org/", {
      topic,
      description,
      difficulty,
      number_of_questions,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.status(200).json({
      success: true,
      questions: data,
    });

  } catch (error) {
    console.error("MCQ Builder Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate MCQs from external service",
    });
  }
};
