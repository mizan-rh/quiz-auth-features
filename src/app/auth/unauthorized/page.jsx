"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLoginAgain = async () => {
    try {
      // Client-side signOut - no server action needed
      await signOut({ 
        redirect: false // Don't auto-redirect
      });
      // Clean navigation to login page
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Navigate anyway if logout fails
      router.replace("/auth/login");
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
            Please login as an admin.
          </p>

          <div className="flex justify-center">
            <Button 
              onClick={handleLoginAgain}
            >
              Login Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}