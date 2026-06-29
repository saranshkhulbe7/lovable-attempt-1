import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          That route doesn't exist. Head back to the workspace.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <ArrowLeft className="size-4" />
          Back to workspace
        </Link>
      </div>
    </main>
  );
}
