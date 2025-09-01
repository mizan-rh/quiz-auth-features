// /src/schemas/questionSchema.js
import { z } from 'zod';

export const questionSchema = z.object({
  text: z.string()
    .min(1, "Question text is required")
    .max(1000, "Question text must be less than 1000 characters"),
  
  type: z.enum(["MCQ", "Text"], {
    required_error: "Question type is required"
  }),
  
  groupId: z.string()
    .min(1, "Please select a group"),
  
  score: z.number()
    .min(1, "Score must be at least 1")
    .max(100, "Score cannot exceed 100"),
  
  choices: z.array(z.object({
    text: z.string().min(1, "Choice text cannot be empty"),
    index: z.number()
  })).optional(),
  
  correct: z.number().optional()
}).refine((data) => {
  // MCQ specific validation
  if (data.type === "MCQ") {
    // Must have at least 2 choices
    if (!data.choices || data.choices.length < 2) {
      return false;
    }
    
    // All choices must have text
    const hasEmptyChoice = data.choices.some(choice => !choice.text.trim());
    if (hasEmptyChoice) {
      return false;
    }
    
    // Must have a correct answer selected
    if (data.correct === null || data.correct === undefined) {
      return false;
    }
    
    // Correct answer must be valid choice index
    const validIndex = data.choices.some(choice => choice.index === data.correct);
    if (!validIndex) {
      return false;
    }
  }
  
  return true;
}, {
  message: "MCQ questions must have at least 2 choices with text and a correct answer selected"
});