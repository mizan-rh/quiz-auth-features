import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, HelpCircle, Trash2 } from "lucide-react";

export default function QuestionRow({ question, index, onDetail, onDelete, onEdit }) {
  return (
    <tr
      className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
      }`}
    >
      {/* Question Text */}
      <td className="py-6 px-6">
        <p
          className="font-semibold text-gray-900 leading-relaxed text-base cursor-pointer hover:underline"
          onClick={() => onDetail(question)}
        >
          {question.text}
        </p>
      </td>

      {/* Type */}
      <td className="py-6 px-4">
        {question.type === "MCQ" ? (
          <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 w-fit shadow-sm">
            <HelpCircle className="w-4 h-4" />
            <span className="font-semibold">MCQ</span>
          </Badge>
        ) : (
          <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 rounded-lg w-fit shadow-sm">
            <span className="font-semibold">TEXT</span>
          </Badge>
        )}
      </td>

      {/* Score */}
      <td className="py-6 px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-fit">
          <span className="font-bold text-amber-800">{question.score}</span>
          <span className="text-amber-600 text-sm ml-1">pts</span>
        </div>
      </td>

      {/* Group */}
      <td className="py-6 px-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 w-fit">
          <span className="text-sm font-semibold text-purple-800">
            {question.group?.name || "No Group"}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-6 px-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200"
            onClick={() => onEdit(question.id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-700 rounded-lg border border-transparent hover:border-red-200 cursor-pointer transition-all duration-200"
            onClick={() => onDelete(question.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
