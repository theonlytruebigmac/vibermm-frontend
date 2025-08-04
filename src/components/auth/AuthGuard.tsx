"use client";

import { useAuth } from "@/contexts/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // Don't do anything while still loading

    // If we're on login page and authenticated, go to dashboard
    if (pathname === "/login" && isAuthenticated) {
      router.replace("/dashboard");
      return;
    }
    
    // If we're on the root path and authenticated, redirect to dashboard
    if (pathname === "/" && isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    // If we're not on login page and not authenticated, go to login
    if (pathname !== "/login" && !isAuthenticated) {
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Don't render anything while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-[#23a69a] text-xl">Loading...</div>
      </div>
    );
  }

  // For login page: only render if not authenticated
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // For protected pages: only render if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-[#23a69a] text-xl">Redirecting...</div>
    </div>
  );
}
