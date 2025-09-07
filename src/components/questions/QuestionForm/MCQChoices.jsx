// MCQChoices.jsx
"use client";

import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function MCQChoices({ 
  choices, 
  correctAnswer, 
  onChoiceChange, 
  onCorrectAnswerChange, 
  errors 
}) {
  return (
    <div>
      <FormLabel>Choices</FormLabel>
      <RadioGroup 
        value={correctAnswer.toString()} 
        onValueChange={onCorrectAnswerChange} 
        className="mt-2"
      >
        {choices.map(choice => (
          <div key={choice.id} className="flex items-center gap-2 mb-2">
            <RadioGroupItem 
              value={choice.id.toString()} 
              id={`choice-${choice.id}`} 
            />
            <FormLabel htmlFor={`choice-${choice.id}`}>
              {String.fromCharCode(65 + choice.id)}
            </FormLabel>
            <Input 
              value={choice.text} 
              onChange={e => onChoiceChange(choice.id, e.target.value)} 
              placeholder={`Enter choice ${String.fromCharCode(65 + choice.id)}`} 
            />
          </div>
        ))}
      </RadioGroup>
      {(errors?.choices || errors?.correct) && (
        <p className="text-sm font-medium text-destructive mt-2">
          {errors?.choices?.message || errors?.correct?.message}
        </p>
      )}
    </div>
  );
}