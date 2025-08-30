import { redirect } from "next/navigation";

export default function Home() {
  // temporary redirect to dashboard
  redirect("/questions");
}
