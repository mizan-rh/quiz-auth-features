"use client";

import { useState, useEffect } from "react";
import { createQuestion, updateQuestion } from "@/app/questions/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
// import { questionSchema } from "@/src/schemas/questionSchema"; // Comment out for now

export default function QuestionForm({ mode, groups, questionData }) {
  const router = useRouter();
  const [questionType, setQuestionType] = useState("MCQ");
  const [score, setScore] = useState("10");
  const [questionGroup, setQuestionGroup] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Initialize choices with default values for create mode
  const [choices, setChoices] = useState([
    { id: 0, text: "Choice A", selected: true },
    { id: 1, text: "Choice B", selected: false },
    { id: 2, text: "Choice C", selected: false },
    { id: 3, text: "Choice D", selected: false },
  ]);

  // Update state when questionData or groups change (edit mode)
  useEffect(() => {
    if (mode === "edit" && questionData && groups?.length > 0) {
      setQuestionType(questionData.type);
      setScore(questionData.score?.toString() || "10");
      setQuestionText(questionData.text || "");
      
      // Set group - make sure the group exists in the groups array
      if (questionData.groupId) {
        const groupExists = groups.find(g => g.id === questionData.groupId);
        if (groupExists) {
          setQuestionGroup(questionData.groupId);
        }
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

  // Auto hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Clear specific field error when user starts typing
  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  // Handle question type change - reset choices when switching to MCQ
  const handleQuestionTypeChange = (newType) => {
    setQuestionType(newType);
    clearFieldError("type");
    
    if (newType === "MCQ" && mode !== "edit") {
      // Reset to default choices when switching to MCQ in create mode
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

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const validateForm = () => {
    const fieldErrors = {};
    
    // Question text validation
    if (!questionText.trim()) {
      fieldErrors.text = "Question text is required";
    } else if (questionText.length > 1000) {
      fieldErrors.text = "Question text must be less than 1000 characters";
    }
    
    // Group validation
    if (!questionGroup) {
      fieldErrors.groupId = "Please select a group";
    }
    
    // Score validation
    const scoreNum = parseInt(score);
    if (!scoreNum || scoreNum < 1) {
      fieldErrors.score = "Score must be at least 1";
    } else if (scoreNum > 100) {
      fieldErrors.score = "Score cannot exceed 100";
    }
    
    // MCQ specific validation
    if (questionType === "MCQ") {
      const emptyChoices = choices.filter(c => !c.text.trim());
      if (emptyChoices.length > 0) {
        fieldErrors.choices = "All choices must have text";
      }
      
      const hasCorrectAnswer = choices.some(c => c.selected);
      if (!hasCorrectAnswer) {
        fieldErrors.correct = "Please select a correct answer";
      }
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
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.replace("/questions");
      }, 1500);
      
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to save question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Success/Error Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === "success" 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm space-y-4 p-6">
        <h2 className="text-xl font-semibold">{mode === "edit" ? "Edit Question" : "Create New Question"}</h2>

        {/* Type, Score, Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Type</Label>
            <Select value={questionType} onValueChange={handleQuestionTypeChange}>
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="Text">Text</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.type}
              </div>
            )}
          </div>

          <div>
            <Label>Score</Label>
            <Input 
              type="number" 
              value={score} 
              onChange={e => {
                setScore(e.target.value);
                clearFieldError("score");
              }}
              className={errors.score ? "border-red-500" : ""}
            />
            {errors.score && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.score}
              </div>
            )}
          </div>

          <div>
            <Label>Group</Label>
            <Select 
              value={questionGroup} 
              onValueChange={(value) => {
                setQuestionGroup(value);
                clearFieldError("groupId");
              }}
            >
              <SelectTrigger className={errors.groupId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups?.map(g => (
                  <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.groupId && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.groupId}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>Question Text</Label>
          <Textarea 
            value={questionText} 
            onChange={e => {
              setQuestionText(e.target.value);
              clearFieldError("text");
            }}
            className={errors.text ? "border-red-500" : ""}
            placeholder="Enter your question here..."
          />
          {errors.text && (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {errors.text}
            </div>
          )}
        </div>

        {questionType === "MCQ" && (
          <div>
            <Label>Choices</Label>
            <RadioGroup value={choices.find(c => c.selected)?.id.toString()} onValueChange={handleCorrectAnswerChange}>
              {choices.map(c => (
                <div key={c.id} className="flex items-center gap-2 mb-2">
                  <RadioGroupItem value={c.id.toString()} id={`choice-${c.id}`} />
                  <Label htmlFor={`choice-${c.id}`}>{String.fromCharCode(65 + c.id)}</Label>
                  <Input 
                    value={c.text} 
                    onChange={e => handleChoiceChange(c.id, e.target.value)}
                    className={errors.choices ? "border-red-500" : ""}
                    placeholder={`Enter choice ${String.fromCharCode(65 + c.id)}`}
                  />
                </div>
              ))}
            </RadioGroup>
            {(errors.choices || errors.correct || errors.mcq) && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.mcq || errors.choices || errors.correct}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
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
    </div>
  );
}