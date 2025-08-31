"use client";

import { deleteQuestion } from "@/app/questions/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Edit, HelpCircle, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function QuestionList({ questions, groups }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteQuestion(deleteId); // server action
      setModalOpen(false);
      setDeleteId(null);
      router.refresh(); // refresh page data
    } catch (err) {
      console.error(err);
      alert("Failed to delete question");
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-6xl mx-auto">
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

        {/* Questions Grid */}
        {filteredQuestions.length === 0 ? (
          <p className="text-center text-muted-foreground mt-12">No questions found.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {question.type === "MCQ" ? (
                        <Badge className="bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
                          <HelpCircle className="w-4 h-4" />
                          MCQ
                        </Badge>
                      ) : (
                        <Badge className="bg-green-600 text-white px-3 py-1 rounded-lg">
                          TEXT
                        </Badge>
                      )}
                      <span className="text-sm font-medium">{question.score} pts</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        onClick={() => router.push(`/questions/${question.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                        onClick={() => openDeleteModal(question.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Group Name */}
                  <div className="mt-3">
                    <span className="text-sm font-medium text-foreground">
                      {question.group?.name}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="mb-4">
                    <p className="font-medium text-foreground">{question.text}</p>
                  </div>

                  {question.type === "MCQ" ? (
                    <div className="space-y-2">
                      {question.choices.map((choice) => (
                        <div
                          key={choice.id}
                          className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                        >
                          <span className="font-medium text-muted-foreground min-w-[20px]">
                            {choice.index + 1}
                          </span>
                          <span className="text-foreground flex-1">{choice.text}</span>
                          {question.correct === choice.index && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertDescription className="text-blue-800">
                        Text answer required - manual grading needed
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this question? This action cannot be undone.</p>
            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
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
