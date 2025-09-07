// schemas/questionSchema.js
import * as z from "zod";

export const questionSchema = z.object({
  text: z.string().min(1).max(1000),
  type: z.enum(["MCQ", "TEXT"], { required_error: "Please select a question type" }),
  groupId: z.string().min(1, "Please select a group"),
  score: z.number().min(1).max(100),
  choices: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
    })
  ).optional(),
  correct: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "MCQ") {
    if (!data.choices || data.choices.length === 0) {
      ctx.addIssue({ 
        code: z.ZodIssueCode.custom, 
        message: "MCQ questions must have choices", 
        path: ["choices"] 
      });
    } else if (data.choices.filter(c => c.text.trim()).length === 0) {
      ctx.addIssue({ 
        code: z.ZodIssueCode.custom, 
        message: "At least one choice must have text", 
        path: ["choices"] 
      });
    }

    if (data.correct === undefined || data.correct === null) {
      ctx.addIssue({ 
        code: z.ZodIssueCode.custom, 
        message: "Please select a correct answer", 
        path: ["correct"] 
      });
    }
  }
});