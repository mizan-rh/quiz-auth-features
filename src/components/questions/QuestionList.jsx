"use client";

import { deleteQuestion } from "@/app/questions/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Edit, HelpCircle, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function QuestionList({ questions, groups }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteQuestion(deleteId);
      setDeleteModalOpen(false);
      setDeleteId(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete question");
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (question) => {
    setSelectedQuestion(question);
    setDetailModalOpen(true);
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const groupMatch = selectedGroup === "all" ? true : q.group?.id === selectedGroup;
      const typeMatch = selectedType === "all" ? true : q.type === selectedType;
      return groupMatch && typeMatch;
    });
  }, [questions, selectedGroup, selectedType]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Question Bank</h1>
            <p className="text-muted-foreground">Create and manage test questions</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 cursor-pointer" onClick={() => router.push("/questions/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select onValueChange={setSelectedGroup} value={selectedGroup}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedType} value={selectedType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="MCQ">MCQ</SelectItem>
              <SelectItem value="TEXT">TEXT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Questions Table */}
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-500 mb-6">Create your first question to get started</p>
              <Button 
                className="bg-black hover:bg-gray-800" 
                onClick={() => router.push("/questions/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>
        ) : (
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
                {filteredQuestions.map((question, index) => (
                  <TableRow 
                    key={question.id} 
                    className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    {/* Question Text (clickable) */}
                    <TableCell className="py-6 px-6">
                      <p
                        className="font-semibold text-gray-900 leading-relaxed text-base cursor-pointer hover:underline"
                        onClick={() => openDetailModal(question)}
                      >
                        {question.text}
                      </p>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="py-6 px-4">
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
                    </TableCell>

                    {/* Score */}
                    <TableCell className="py-6 px-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-fit">
                        <span className="font-bold text-amber-800">{question.score}</span>
                        <span className="text-amber-600 text-sm ml-1">pts</span>
                      </div>
                    </TableCell>

                    {/* Group */}
                    <TableCell className="py-6 px-4">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 w-fit">
                        <span className="text-sm font-semibold text-purple-800">
                          {question.group?.name || "No Group"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-6 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200"
                          onClick={() => router.push(`/questions/${question.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-700 rounded-lg border border-transparent hover:border-red-200 cursor-pointer transition-all duration-200"
                          onClick={() => openDeleteModal(question.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Detail Modal */}
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Question Details</DialogTitle>
            </DialogHeader>

            {selectedQuestion && (
              <div className="space-y-4">
                {/* Question Text */}
                <p className="font-semibold text-gray-900">{selectedQuestion.text}</p>

                {/* Description */}
                {selectedQuestion.description && (
                  <p className="text-gray-700 text-sm">{selectedQuestion.description}</p>
                )}

                {/* MCQ Choices */}
                {selectedQuestion.type === "MCQ" && (
                  <div className="space-y-2">
                    {selectedQuestion.choices.map((choice) => (
                      <div
                        key={choice.id}
                        className={`flex items-center gap-3 p-3 rounded-lg text-sm ${
                          selectedQuestion.correct === choice.index
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <span className="font-bold text-gray-600">{choice.index + 1}.</span>
                        <span className="flex-1">{choice.text}</span>
                        {selectedQuestion.correct === choice.index && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* TEXT type */}
                {selectedQuestion.type === "TEXT" && (
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

        {/* Delete Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this question? This action cannot be undone.</p>
            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
