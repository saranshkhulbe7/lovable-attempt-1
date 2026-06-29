import type { ReactNode } from "react";
import { ArrowUpRight, Boxes, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@lovable/ui/components/badge";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-zinc-50">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.1),#07070a_72%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 text-sm font-semibold text-zinc-100"
          >
            <span className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white text-black shadow-sm">
              <Boxes className="size-4" />
            </span>
            Lovable
          </Link>

          <a
            href="https://lovable.dev"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white sm:flex"
          >
            lovable.dev
            <ArrowUpRight className="size-3.5" />
          </a>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="max-w-2xl">
            <Badge className="border border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-100">
              <Sparkles className="size-3" />
              ship in dark mode
            </Badge>

            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Build something lovable.
            </h1>

            <div className="mt-7 max-w-xl rounded-lg border border-white/10 bg-[#101014]/90 p-3 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="rounded-md border border-white/10 bg-black/30 p-4">
                <p className="text-sm text-zinc-300">
                  Create a polished product dashboard with authentication,
                  profile management, and a clean workspace shell.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                <span>React + Vite</span>
                <span className="rounded-md bg-white px-2 py-1 font-medium text-black">
                  Generate
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">{children}</div>
        </section>
      </div>
    </main>
  );
}
