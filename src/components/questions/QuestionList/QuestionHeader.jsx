import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function QuestionHeader({ onAdd }) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Question Bank</h1>
        <p className="text-muted-foreground">Create and manage test questions</p>
      </div>
      <Button
        className="bg-black hover:bg-gray-800 cursor-pointer"
        onClick={onAdd}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </Button>
    </div>
  );
}
