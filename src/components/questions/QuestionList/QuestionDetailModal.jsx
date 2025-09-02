import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export default function QuestionDetailModal({ open, onOpenChange, question }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Question Details</DialogTitle>
        </DialogHeader>

        {question && (
          <div className="space-y-4">
            {/* Text */}
            <p className="font-semibold text-gray-900">{question.text}</p>

            {/* Description */}
            {question.description && (
              <p className="text-gray-700 text-sm">{question.description}</p>
            )}

            {/* MCQ */}
            {question.type === "MCQ" && (
              <div className="space-y-2">
                {question.choices.map((choice) => (
                  <div
                    key={choice.id}
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                      question.correct === choice.index
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <span className="font-bold text-gray-600">{choice.index + 1}.</span>
                    <span className="flex-1">{choice.text}</span>
                    {question.correct === choice.index && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TEXT */}
            {question.type === "TEXT" && (
              <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <AlertDescription className="text-blue-800 text-sm font-medium">
                  💭 Text answer required - manual grading needed
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
