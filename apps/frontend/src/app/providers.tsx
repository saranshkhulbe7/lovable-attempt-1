import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@lovable/ui/components/sonner";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-right" theme="dark" />
    </QueryClientProvider>
  );
}
