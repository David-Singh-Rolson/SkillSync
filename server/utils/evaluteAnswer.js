export const evaluateAnswer = (response, question) => {
    let isCorrect = false;
    let marksAwarded = 0;
  
    switch (question.questionType) {
      case "SingleCorrect":
        isCorrect = response.selectedOptionIndex === question.correctOptionIndex;
        marksAwarded = isCorrect ? question.marks : 0;
        break;
  
    //   case "MultiCorrect":
    //     const selected = response.selectedOptionIndexes || [];
    //     const correct = question.correctOption || [];
  
    //     const setsEqual = (
    //       selected.length === correct.length &&
    //       selected.every((opt) => correct.includes(opt))
    //     );
  
    //     isCorrect = setsEqual;
    //     marksAwarded = isCorrect ? question.marks : 0;
    //     break;
  
    //   case "TrueFalse":
    //     isCorrect = response.selectedOptionIndex === question.correctOption[0];
    //     marksAwarded = isCorrect ? question.marks : 0;
    //     break;
  
    //   case "Integer":
    //     isCorrect = response.selectedOptionIndex === question.correctOption[0];
    //     marksAwarded = isCorrect ? question.marks : 0;
    //     break;
  
      default:
        break;
    }
  
    return { isCorrect, marksAwarded };
  };
  