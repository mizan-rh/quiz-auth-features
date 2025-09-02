"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

export default function QuestionMetaFields({
  questionType,
  setQuestionType,
  score,
  setScore,
  questionGroup,
  setQuestionGroup,
  groups,
  errors,
  clearFieldError,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Type */}
      <div>
        <Label>Type</Label>
        <Select value={questionType} onValueChange={(val) => { setQuestionType(val); clearFieldError("type"); }}>
          <SelectTrigger className={errors.type ? "border-red-500" : ""}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MCQ">MCQ</SelectItem>
            <SelectItem value="Text">Text</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <ErrorMsg msg={errors.type} />}
      </div>

      {/* Score */}
      <div>
        <Label>Score</Label>
        <Input 
          type="number"
          value={score}
          onChange={e => { setScore(e.target.value); clearFieldError("score"); }}
          className={errors.score ? "border-red-500" : ""}
        />
        {errors.score && <ErrorMsg msg={errors.score} />}
      </div>

      {/* Group */}
      <div>
        <Label>Group</Label>
        <Select 
          value={questionGroup}
          onValueChange={(val) => { setQuestionGroup(val); clearFieldError("groupId"); }}
        >
          <SelectTrigger className={errors.groupId ? "border-red-500" : ""}>
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            {groups?.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.groupId && <ErrorMsg msg={errors.groupId} />}
      </div>
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
