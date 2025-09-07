"use client";

import { createQuestion, updateQuestion } from "@/app/questions/actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Validation schema
const questionSchema = z.object({
  text: z.string().min(1).max(1000),
  type: z.enum(["MCQ", "TEXT"], { required_error: "Please select a question type" }),
  groupId: z.string().min(1, "Please select a group"),
  score: z.number().min(1).max(100),
  choices: z.array(z.object({
    id: z.number(),
    text: z.string(),
  })).optional(),
  correct: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "MCQ") {
    if (!data.choices || data.choices.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "MCQ questions must have choices",
        path: ["choices"],
      });
    } else {
      // Check if at least one choice has text
      const nonEmptyChoices = data.choices.filter(c => c.text.trim());
      if (nonEmptyChoices.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one choice must have text",
          path: ["choices"],
        });
      }
    }

    if (data.correct === undefined || data.correct === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a correct answer",
        path: ["correct"],
      });
    }
  }
});

export default function QuestionForm({ mode, groups, questionData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formInitialized, setFormInitialized] = useState(mode === "create");

  const [choices, setChoices] = useState([
    { id: 0, text: "" },
    { id: 1, text: "" },
    { id: 2, text: "" },
    { id: 3, text: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      type: undefined, // No default, will come from questionData
      groupId: "",
      score: 10,
      choices,
      correct: correctAnswer,
    },
  });

  const { watch } = form;
  const questionType = watch("type");

  // Initialize form in edit mode
  useEffect(() => {
    if (mode === "edit" && questionData && groups?.length > 0) {
      const editChoices = questionData.type === "MCQ" && questionData.choices?.length
        ? questionData.choices.map(c => ({ id: c.index, text: c.text }))
        : choices;

      const editCorrectAnswer = questionData.type === "MCQ" ? questionData.correct : 0;

      setChoices(editChoices);
      setCorrectAnswer(editCorrectAnswer);

      form.reset({
        text: questionData.text || "",
        type: questionData.type,
        groupId: questionData.groupId || "",
        score: questionData.score || 10,
        choices: editChoices,
        correct: editCorrectAnswer,
      });

      setFormInitialized(true);
    }
  }, [mode, questionData, groups, form]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleQuestionTypeChange = (newType) => {
    if (newType === "MCQ" && mode !== "edit") {
      // Keep choices empty for new MCQ questions
      const emptyChoices = [
        { id: 0, text: "" },
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
      ];
      setChoices(emptyChoices);
      setCorrectAnswer(0);
      form.setValue("choices", emptyChoices);
      form.setValue("correct", 0);
    }
    form.setValue("type", newType);
  };

  const handleChoiceChange = (id, text) => {
    const updatedChoices = choices.map(c => (c.id === id ? { ...c, text } : c));
    setChoices(updatedChoices);
    form.setValue("choices", updatedChoices);
  };

  const handleCorrectAnswerChange = (id) => {
    const correctId = parseInt(id);
    setCorrectAnswer(correctId);
    form.setValue("correct", correctId);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        text: data.text,
        type: data.type,
        groupId: data.groupId,
        score: data.score,
        choices: data.type === "MCQ" ? data.choices
          .filter(c => c.text.trim()) // Only include non-empty choices
          .map(c => ({ text: c.text, index: c.id })) : [],
        correct: data.type === "MCQ" ? data.correct : null,
      };

      if (mode === "edit") {
        await updateQuestion(questionData.id, payload);
        showNotification("success", "Question updated successfully!");
      } else {
        await createQuestion(payload);
        showNotification("success", "Question created successfully!");
      }

      setTimeout(() => router.replace("/questions"), 1500);
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to save question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white`}>
          {notification.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">{mode === "edit" ? "Edit Question" : "Create New Question"}</h2>

        {formInitialized ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          handleQuestionTypeChange(val);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MCQ">MCQ</SelectItem>
                          <SelectItem value="TEXT">Text</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="groupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {groups?.map((g) => (
                            <SelectItem key={g.id} value={g.id}>
                              {g.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter your question here..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {questionType === "MCQ" && (
                <div>
                  <FormLabel>Choices</FormLabel>
                  <RadioGroup
                    value={correctAnswer.toString()}
                    onValueChange={handleCorrectAnswerChange}
                    className="mt-2"
                  >
                    {choices.map((c) => (
                      <div key={c.id} className="flex items-center gap-2 mb-2">
                        <RadioGroupItem value={c.id.toString()} id={`choice-${c.id}`} />
                        <FormLabel htmlFor={`choice-${c.id}`}>{String.fromCharCode(65 + c.id)}</FormLabel>
                        <Input
                          value={c.text}
                          onChange={(e) => handleChoiceChange(c.id, e.target.value)}
                          placeholder={`Enter choice ${String.fromCharCode(65 + c.id)}`}
                        />
                      </div>
                    ))}
                  </RadioGroup>
                  {(form.formState.errors.choices || form.formState.errors.correct) && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {form.formState.errors.choices?.message || form.formState.errors.correct?.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading
                    ? mode === "edit"
                      ? "Updating..."
                      : "Creating..."
                    : mode === "edit"
                    ? "Update"
                    : "Create"}
                </Button>
                <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center py-20 text-muted-foreground">Loading form...</div>
        )}
      </div>
    </div>
  );
}