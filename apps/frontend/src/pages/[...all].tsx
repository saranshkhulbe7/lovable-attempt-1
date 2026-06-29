import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080b] px-6 text-zinc-100">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40">
        <p className="text-sm text-zinc-500">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">
          Page not found
        </h1>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          <ArrowLeft className="size-4" />
          Back to workspace
        </Link>
      </div>
    </main>
  );
}
