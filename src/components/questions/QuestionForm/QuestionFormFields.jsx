// QuestionFormFields.jsx
"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MCQChoices from "./MCQChoices";

export default function QuestionFormFields({ 
  form, 
  groups, 
  questionType,
  choices,
  correctAnswer,
  onQuestionTypeChange,
  onChoiceChange,
  onCorrectAnswerChange
}) {
  return (
    <div className="space-y-6">
      {/* Type, Score, Group Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type */}
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
                  onQuestionTypeChange(val); 
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

        {/* Score */}
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
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                  value={field.value} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        {/* Group */}
        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
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

      {/* Question Text */}
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

      {/* MCQ Choices */}
      {questionType === "MCQ" && (
        <MCQChoices
          choices={choices}
          correctAnswer={correctAnswer}
          onChoiceChange={onChoiceChange}
          onCorrectAnswerChange={onCorrectAnswerChange}
          errors={form.formState.errors}
        />
      )}
    </div>
  );
}