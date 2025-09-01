"use client";

import { logout } from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  // Clean URL on page load to remove any callback parameters
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState({}, '', '/auth/unauthorized');
    }
  }, []);

  const handleLoginAgain = async () => {
    try {
      await logout();
      // Force clean redirect - remove any query params
      window.location.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: direct redirect even if logout fails
      window.location.replace("/auth/login");
    }
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
            You don't have permission to access this page.  
            Please contact an administrator if you think this is a mistake.
          </p>

          <div className="flex justify-center gap-3">
            <Button onClick={handleLoginAgain}>
              Login Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}