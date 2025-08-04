"use client";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { AuthProvider } from "@/contexts/auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePathname } from "next/navigation";

// Metadata moved to separate Metadata file as it's not compatible with "use client"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>VibeRMM</title>
        <meta name="description" content="Who Said RMM Can't Be a Vibe?" />
      </head>
      <body className="min-h-screen bg-gray-900 text-gray-100">
        <AuthProvider>
          <AuthGuard>
            {pathname === "/login" ? (
              children
            ) : (
              <ClientLayout>{children}</ClientLayout>
            )}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
