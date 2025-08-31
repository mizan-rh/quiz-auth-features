"use client";

import { useState, useEffect } from "react";
import { createQuestion, updateQuestion } from "@/app/questions/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function QuestionForm({ mode, groups, questionData }) {
  const [questionType, setQuestionType] = useState("MCQ");
  const [score, setScore] = useState("10");
  const [questionGroup, setQuestionGroup] = useState("");
  const [questionText, setQuestionText] = useState("");
  
  // Initialize choices with default values for create mode
  const [choices, setChoices] = useState([
    { id: 0, text: "Choice A", selected: true },
    { id: 1, text: "Choice B", selected: false },
    { id: 2, text: "Choice C", selected: false },
    { id: 3, text: "Choice D", selected: false },
  ]);

  // Only update state when questionData changes (edit mode)
  useEffect(() => {
    if (mode === "edit" && questionData) {
      setQuestionType(questionData.type);
      setScore(questionData.score?.toString() || "10");
      setQuestionGroup(questionData.groupId || "");
      setQuestionText(questionData.text || "");
      
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
  }, [mode, questionData]);

  // Handle question type change - reset choices when switching to MCQ
  const handleQuestionTypeChange = (newType) => {
    setQuestionType(newType);
    
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
  };

  const handleCorrectAnswerChange = id => {
    setChoices(choices.map(c => ({ ...c, selected: c.id === parseInt(id) })));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      text: questionText,
      type: questionType,
      groupId: questionGroup,
      score: parseInt(score),
      choices: questionType === "MCQ" ? choices.map(c => ({ text: c.text, index: c.id })) : [],
      correct: questionType === "MCQ" ? choices.find(c => c.selected)?.id : null,
    };

    try {
      if (mode === "edit") {
        await updateQuestion(questionData.id, payload);
      } else {
        await createQuestion(payload);
      }
      alert("Question saved!");
      window.location.href = "/questions";
    } catch (err) {
      console.error(err);
      alert("Failed to save question");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white border rounded-lg shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">{mode === "edit" ? "Edit Question" : "Create New Question"}</h2>

      {/* Type, Score, Group */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Type</Label>
          <Select value={questionType} onValueChange={handleQuestionTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MCQ">MCQ</SelectItem>
              <SelectItem value="Text">Text</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Score</Label>
          <Input type="number" value={score} onChange={e => setScore(e.target.value)} />
        </div>

        <div>
          <Label>Group</Label>
          <Select value={questionGroup} onValueChange={setQuestionGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map(g => (
                <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Question Text</Label>
        <Textarea value={questionText} onChange={e => setQuestionText(e.target.value)} />
      </div>

      {questionType === "MCQ" && (
        <div>
          <Label>Choices</Label>
          <RadioGroup value={choices.find(c => c.selected)?.id.toString()} onValueChange={handleCorrectAnswerChange}>
            {choices.map(c => (
              <div key={c.id} className="flex items-center gap-2 mb-2">
                <RadioGroupItem value={c.id.toString()} id={`choice-${c.id}`} />
                <Label htmlFor={`choice-${c.id}`}>{String.fromCharCode(65 + c.id)}</Label>
                <Input value={c.text} onChange={e => handleChoiceChange(c.id, e.target.value)} />
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit">{mode === "edit" ? "Update" : "Create"}</Button>
        <Button variant="outline" type="button" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}