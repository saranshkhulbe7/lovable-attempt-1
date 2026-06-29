import { ArrowLeft, LogOut, PanelLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useWorkspace } from "@/lib/workspace";
import { Button } from "@lovable/ui/components/button";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="break-all font-mono text-sm text-foreground">
        {value}
      </span>
    </div>
  );
}

export function AccountPanel({ onMenu }: { onMenu?: () => void }) {
  const { data: user, isPending } = useCurrentUser();
  const { setView } = useWorkspace();

  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-8">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            aria-label="Open menu"
            className="-ml-1 flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <PanelLeft className="size-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setView("chat")}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
          aria-label="Back to chat"
        >
          <ArrowLeft className="size-4" />
        </button>
        <span className="font-mono text-sm text-foreground">Account</span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-xl bg-secondary font-mono text-xl text-foreground">
              {user?.email?.charAt(0).toUpperCase() ?? "·"}
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">
                {isPending ? "Loading…" : (user?.email ?? "Unknown")}
              </p>
              <p className="text-sm text-muted-foreground">Signed in</p>
            </div>
          </div>

          <div className="mt-8 border-t border-border">
            <Field label="Email" value={user?.email ?? "—"} />
            <Field label="User ID" value={user?.id ?? "—"} />
          </div>

          <Button asChild variant="outline" className="mt-8">
            <Link to="/logout">
              <LogOut className="size-4" />
              Log out
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
