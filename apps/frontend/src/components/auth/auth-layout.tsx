import type { ReactNode } from "react";
import { AuthVisual } from "@/components/auth/auth-visual";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      <AuthVisual />
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </main>
  );
}
