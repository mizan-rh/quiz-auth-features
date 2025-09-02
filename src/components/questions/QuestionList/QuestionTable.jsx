import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HelpCircle, Plus } from "lucide-react";
import QuestionRow from "./QuestionRow";

export default function QuestionTable({ questions, onDetail, onDelete, onEdit, onAdd }) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-500 mb-6">Create your first question to get started</p>
          <Button className="bg-black hover:bg-gray-800" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <TableHead className="font-bold text-gray-800 py-4 px-6">Question Text</TableHead>
            <TableHead className="font-bold text-gray-800 py-4 px-4 w-28">Type</TableHead>
            <TableHead className="font-bold text-gray-800 py-4 px-4 w-24">Score</TableHead>
            <TableHead className="font-bold text-gray-800 py-4 px-4 w-36">Group</TableHead>
            <TableHead className="font-bold text-gray-800 py-4 px-4 w-28 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((q, i) => (
            <QuestionRow
              key={q.id}
              question={q}
              index={i}
              onDetail={onDetail}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
