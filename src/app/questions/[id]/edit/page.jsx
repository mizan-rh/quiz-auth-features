// app/questions/[id]/edit/page.js
import QuestionForm from "@/components/questions/QuestionForm";
import { getGroups, getQuestionById, getQuestions } from "../../actions";

export default async function EditQuestionPage({ params }) {
  // Await params before using its properties
  const resolvedParams = await params;
  
  const groups = await getGroups();
  const questionData = await getQuestionById(resolvedParams.id);
 
  // console.log(questionData, "questionData");
 

  return (
    <div>
      <QuestionForm mode="edit" groups={groups} questionData={questionData} />
    </div>
  );
}