// app/questions/[id]/edit/page.js
import QuestionForm from "@/components/questions/QuestionForm";
import { getGroups, getQuestions } from "../../actions";

export default async function EditQuestionPage({ params }) {
  const groups = await getGroups();
  const questionData = (await getQuestions({ id: params.id }))[0];

  return (
    <div>
      <QuestionForm mode="edit" groups={groups} questionData={questionData} />
    </div>
  );
}
