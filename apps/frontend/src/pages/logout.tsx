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
    <main className="flex min-h-screen items-center justify-center bg-[#08080b] px-6 text-zinc-100">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl shadow-black/40">
        <span className="mx-auto flex size-10 items-center justify-center rounded-lg bg-white text-black">
          <LogOut className="size-4" />
        </span>
        <h1 className="mt-5 text-xl font-semibold text-white">Signing out</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Closing the current session.
        </p>
        <LoaderCircle className="mx-auto mt-5 size-5 animate-spin text-zinc-400" />
      </div>
    </main>
  );
}
