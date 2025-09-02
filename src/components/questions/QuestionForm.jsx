"use client";

import { createQuestion, updateQuestion } from "@/app/questions/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ChoicesField from "./QuestionForm/ChoicesField";
import Notification from "./QuestionForm/Notification";
import QuestionMetaFields from "./QuestionForm/QuestionMetaFields";

export default function QuestionForm({ mode, groups, questionData }) {
  const router = useRouter();
  const [questionType, setQuestionType] = useState("MCQ");
  const [score, setScore] = useState("10");
  const [questionGroup, setQuestionGroup] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});
  const [choices, setChoices] = useState([
    { id: 0, text: "Choice A", selected: true },
    { id: 1, text: "Choice B", selected: false },
    { id: 2, text: "Choice C", selected: false },
    { id: 3, text: "Choice D", selected: false },
  ]);

  // ---------------- useEffects ----------------
  useEffect(() => {
    if (mode === "edit" && questionData && groups?.length > 0) {
      setQuestionType(questionData.type);
      setScore(questionData.score?.toString() || "10");
      setQuestionText(questionData.text || "");
      if (questionData.groupId) {
        const groupExists = groups.find(g => g.id === questionData.groupId);
        if (groupExists) setQuestionGroup(questionData.groupId);
      }
      if (questionData.type === "MCQ" && questionData.choices?.length) {
        setChoices(
          questionData.choices.map(c => ({
            id: c.index,
            text: c.text,
            selected: c.index === questionData.correct
          }))
        );
      }
    }
  }, [mode, questionData, groups]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ---------------- Handlers ----------------
  const clearFieldError = (field) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleQuestionTypeChange = (newType) => {
    setQuestionType(newType);
    clearFieldError("type");
    if (newType === "MCQ" && mode !== "edit") {
      setChoices([
        { id: 0, text: "Choice A", selected: true },
        { id: 1, text: "Choice B", selected: false },
        { id: 2, text: "Choice C", selected: false },
        { id: 3, text: "Choice D", selected: false },
      ]);
    }
  };

  const handleChoiceChange = (id, text) => {
    setChoices(choices.map(c => (c.id === id ? { ...c, text } : c)));
    clearFieldError("choices");
  };

  const handleCorrectAnswerChange = id => {
    setChoices(choices.map(c => ({ ...c, selected: c.id === parseInt(id) })));
    clearFieldError("correct");
  };

  const showNotification = (type, message) => setNotification({ type, message });

  const validateForm = () => {
    const fieldErrors = {};
    if (!questionText.trim()) {
      fieldErrors.text = "Question text is required";
    } else if (questionText.length > 1000) {
      fieldErrors.text = "Question text must be less than 1000 characters";
    }
    if (!questionGroup) fieldErrors.groupId = "Please select a group";
    const scoreNum = parseInt(score);
    if (!scoreNum || scoreNum < 1) fieldErrors.score = "Score must be at least 1";
    else if (scoreNum > 100) fieldErrors.score = "Score cannot exceed 100";
    if (questionType === "MCQ") {
      if (choices.some(c => !c.text.trim())) fieldErrors.choices = "All choices must have text";
      if (!choices.some(c => c.selected)) fieldErrors.correct = "Please select a correct answer";
    }

    const payload = {
      text: questionText,
      type: questionType,
      groupId: questionGroup,
      score: parseInt(score),
      choices: questionType === "MCQ" ? choices.map(c => ({ text: c.text, index: c.id })) : [],
      correct: questionType === "MCQ" ? choices.find(c => c.selected)?.id : null,
    };

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return { success: false, errors: fieldErrors };
    }
    setErrors({});
    return { success: true, data: payload };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validation = validateForm();
    if (!validation.success) {
      showNotification("error", "Please fix the errors and try again.");
      return;
    }
    setIsLoading(true);
    try {
      if (mode === "edit") {
        await updateQuestion(questionData.id, validation.data);
        showNotification("success", "Question updated successfully!");
      } else {
        await createQuestion(validation.data);
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

  // ---------------- UI ----------------
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <Notification notification={notification} />

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm space-y-4 p-6">
        <h2 className="text-xl font-semibold">{mode === "edit" ? "Edit Question" : "Create New Question"}</h2>

        <QuestionMetaFields
          questionType={questionType}
          setQuestionType={handleQuestionTypeChange}
          score={score}
          setScore={setScore}
          questionGroup={questionGroup}
          setQuestionGroup={setQuestionGroup}
          groups={groups}
          errors={errors}
          clearFieldError={clearFieldError}
        />

        {/* Question Text */}
        <div>
          <Label>Question Text</Label>
          <Textarea 
            value={questionText}
            onChange={e => { setQuestionText(e.target.value); clearFieldError("text"); }}
            className={errors.text ? "border-red-500" : ""}
            placeholder="Enter your question here..."
          />
          {errors.text && (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" /> {errors.text}
            </div>
          )}
        </div>

        {questionType === "MCQ" && (
          <ChoicesField 
            choices={choices}
            handleChoiceChange={handleChoiceChange}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            errors={errors}
          />
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? (mode === "edit" ? "Updating..." : "Creating...") : (mode === "edit" ? "Update" : "Create")}
          </Button>
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
