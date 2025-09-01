"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { logout } from "@/actions/auth/logout";

export default function UnauthorizedPage() {
  const handleLoginAgain = async () => {
    await logout(); // server action → clears session
    window.location.href = "/auth/login"; // redirect after logout
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <ShieldAlert className="h-12 w-12 text-red-500" />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            You don’t have permission to access this page.  
            Please contact an administrator if you think this is a mistake.
          </p>

          <div className="flex justify-center gap-3">
            <Button asChild variant="outline">
              <a href="/">Go Home</a>
            </Button>
            <Button onClick={handleLoginAgain}>
              Login Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
