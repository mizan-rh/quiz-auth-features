// app/questions/new/page.js
import QuestionForm from "@/components/questions/QuestionForm";
import { getGroups } from "../actions"; // your server action

export default async function NewQuestionPage() {
  const groups = await getGroups(); // fetch on server

  return (
    <div>
      <QuestionForm mode="create" groups={groups} />
    </div>
  );
}
