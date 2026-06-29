import { useEffect } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { currentUserQueryKey } from "@/hooks/use-current-user";
import { logout } from "@/lib/auth";

export default function LogoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;

    void logout()
      .catch(() => undefined)
      .finally(() => {
        queryClient.removeQueries({ queryKey: currentUserQueryKey });

        if (active) {
          navigate("/login", { replace: true });
        }
      });

    return () => {
      active = false;
    };
  }, [navigate, queryClient]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center">
        <span className="mx-auto flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
          <LogOut className="size-4" />
        </span>
        <h1 className="mt-5 font-display text-lg font-semibold text-foreground">
          Signing out
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Closing the current session.
        </p>
        <LoaderCircle className="mx-auto mt-5 size-5 animate-spin text-muted-foreground" />
      </div>
    </main>
  );
}
