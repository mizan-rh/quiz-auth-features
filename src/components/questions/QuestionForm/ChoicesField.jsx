"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";

export default function ChoicesField({ choices, handleChoiceChange, handleCorrectAnswerChange, errors }) {
  return (
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
      {(errors.choices || errors.correct) && <ErrorMsg msg={errors.choices || errors.correct} />}
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
      <AlertCircle className="w-4 h-4" /> {msg}
    </div>
  );
}
