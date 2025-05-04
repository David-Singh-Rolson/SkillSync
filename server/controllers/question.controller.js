import { Question } from "../models/question.model.js";

export const createQuestion = async (req, res) => {
  try {
    console.log("ai gen ques in contr",req.body);
    const {
      questionText,
      topic,
      difficulty,
      marks,
      questionType,
      options,
      correctOptionIndex,
      correctOptionIndexes,
      correctIntegerAnswer,
      correctAnswer,
    } = req.body;

    if (
        !questionText ||
        !topic ||
        !difficulty ||
        !questionType
      ) {
        return res.status(400).json({
          message: "Required fields are missing",
        });
      }

    const currentQuestion = await Question.create({
      questionText,
      topic,
      difficulty,
      marks,
      questionType,
      options,
      correctOptionIndex,
      correctOptionIndexes,
      correctIntegerAnswer,
      correctAnswer,
      createdBy: req.id,
    });

    console.log("currQues",currentQuestion);
    return res.status(201).json({currentQuestion,message:"Question Created"})// why not comming
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Question",
    });
  }
};

// setQuestion({
//     questionText: "",
//     topic: "",
//     difficulty: "",
//     marks: 0,
//     questionType: "",
//     options: ["", ""],
//     correctOptionIndex: null,
//     correctOptionIndexes: [],
//     correctAnswer: null,
//     answer: "",
//   });
