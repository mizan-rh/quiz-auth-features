import { redirect } from "next/navigation";

export default function Home() {
  // temporary redirect to dashboard
  // redirect("/questions");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        Welcome to Quiz App!
      </div>
    </main>
  );
}
