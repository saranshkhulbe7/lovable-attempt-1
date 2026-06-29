import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@lovable/ui/components/sonner";
import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/lib/workspace";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkspaceProvider>{children}</WorkspaceProvider>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          classNames: {
            toast:
              "!bg-popover !border-border !text-foreground !rounded-md font-sans",
            description: "!text-muted-foreground",
          },
        }}
      />
    </QueryClientProvider>
  );
}
