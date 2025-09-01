"use server";

// Simple logout without NextAuth signOut
export const logout = async () => {
  // Just return success - let client handle the redirect
  // NextAuth session will be cleared on next request
  return { success: true };
};