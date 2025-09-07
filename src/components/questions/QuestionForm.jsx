// components/QuestionForm.jsx
"use client";

import { createQuestion, updateQuestion } from "@/app/questions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { questionSchema } from "@/schemas/questionSchema";
import QuestionFormFields from "./QuestionForm/QuestionFormFields";

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
      type: undefined,
      groupId: "",
      score: 10,
      choices,
      correct: correctAnswer
    },
  });

  const { watch } = form;
  const questionType = watch("type");

  // Initialize form for edit mode
  useEffect(() => {
    if (mode === "edit" && questionData && groups?.length) {
      if (questionData.type === "MCQ") {
        let editChoices = questionData.choices?.map((c, i) => ({ id: i, text: c.text })) || [];
        while (editChoices.length < 4) {
          editChoices.push({ id: editChoices.length, text: "" });
        }

        const editCorrect = questionData.correct ?? 0;

        setChoices(editChoices);
        setCorrectAnswer(editCorrect);
        form.reset({
          text: questionData.text,
          type: questionData.type,
          groupId: questionData.groupId,
          score: questionData.score,
          choices: editChoices,
          correct: editCorrect,
        });
      } else {
        form.reset({
          text: questionData.text,
          type: questionData.type,
          groupId: questionData.groupId,
          score: questionData.score,
        });
      }
      setFormInitialized(true);
    }
  }, [mode, questionData, groups, form]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleQuestionTypeChange = (newType) => {
    if (newType === "MCQ" && mode !== "edit") {
      const emptyChoices = [
        { id: 0, text: "" },
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" }
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

  const showNotification = (type, message) => setNotification({ type, message });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        text: data.text,
        type: data.type,
        groupId: data.groupId,
        score: data.score,
        choices: data.type === "MCQ"
          ? data.choices.filter(c => c.text.trim()).map(c => ({ text: c.text, index: c.id }))
          : [],
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
    } catch {
      showNotification("error", "Failed to save question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}>
          {notification.type === "success" ?
            <CheckCircle className="w-5 h-5" /> :
            <XCircle className="w-5 h-5" />
          }
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Question Bank
          </h1>
          <p className="text-muted-foreground">
            Create and manage test questions
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>
            {mode === "edit" ? "Edit Question" : "Create New Question"}
          </CardTitle>
          <CardDescription>
            Fill the form to {mode === "edit" ? "update" : "create"} a question
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formInitialized ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <QuestionFormFields
                  form={form}
                  groups={groups}
                  questionType={questionType}
                  choices={choices}
                  correctAnswer={correctAnswer}
                  onQuestionTypeChange={handleQuestionTypeChange}
                  onChoiceChange={handleChoiceChange}
                  onCorrectAnswerChange={handleCorrectAnswerChange}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 mt-6 border-t">
                  <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading
                      ? (mode === "edit" ? "Updating..." : "Creating...")
                      : (mode === "edit" ? "Update" : "Create")
                    }
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              Loading form...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}