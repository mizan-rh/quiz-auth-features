"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { deleteQuestion } from "@/app/questions/actions";

import QuestionHeader from "./QuestionList/QuestionHeader";
import QuestionFilters from "./QuestionList/QuestionFilters";
import QuestionTable from "./QuestionList/QuestionTable";
import QuestionDetailModal from "./QuestionList/QuestionDetailModal";
import QuestionDeleteModal from "./QuestionList/QuestionDeleteModal";

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
        <QuestionHeader onAdd={() => router.push("/questions/new")} />

        <QuestionFilters
          groups={groups}
          selectedGroup={selectedGroup}
          selectedType={selectedType}
          onGroupChange={setSelectedGroup}
          onTypeChange={setSelectedType}
        />

        <QuestionTable
          questions={filteredQuestions}
          onDetail={openDetailModal}
          onDelete={openDeleteModal}
          onEdit={(id) => router.push(`/questions/${id}/edit`)}
          onAdd={() => router.push("/questions/new")}
        />

        <QuestionDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          question={selectedQuestion}
        />

        <QuestionDeleteModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          confirmDelete={confirmDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}
