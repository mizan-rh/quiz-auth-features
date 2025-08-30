import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

const LoginPage = () => {
  return <Suspense>
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <LoginForm />
    </div></Suspense>;
};

export default LoginPage;
