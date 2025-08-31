import QuestionList from "@/components/questions/QuestionList";
import { getGroups, getQuestions } from "./actions";

export default async function QuestionsPage() {
  // Server-side fetch
  const questions = await getQuestions();
  const groups = await getGroups();

  return <QuestionList questions={questions} groups={groups} />;
}
