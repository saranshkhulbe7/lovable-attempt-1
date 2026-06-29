import { FormEvent, useState } from "react";
import {
  ArrowUp,
  Blocks,
  Code2,
  MonitorPlay,
  Sparkles,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";

import { Badge } from "@lovable/ui/components/badge";
import { Button } from "@lovable/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lovable/ui/components/card";
import { Textarea } from "@lovable/ui/components/textarea";

const starters = [
  "AI landing page",
  "SaaS dashboard",
  "Auth flow",
  "Portfolio site",
];

const projectCards = [
  {
    title: "Frontend",
    description: "React, Vite, Tailwind, and shared UI primitives.",
    icon: Blocks,
  },
  {
    title: "Backend",
    description: "Hono routes with cookie sessions and typed auth payloads.",
    icon: Code2,
  },
  {
    title: "Preview",
    description: "Local proxy keeps auth requests on the same browser origin.",
    icon: MonitorPlay,
  },
];

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      toast.message("Add a project prompt first");
      return;
    }

    toast.success("Project brief ready");
    setPrompt("");
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-8">
        <section className="pt-4 sm:pt-8">
          <Badge className="border border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-100">
            <Sparkles className="size-3" />
            lovable mode
          </Badge>

          <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                What do you want to build?
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Shape the product, wire the auth, and keep the workspace moving.
              </p>
            </div>

            <Button
              asChild
              variant="secondary"
              className="h-10 w-fit border border-white/10 bg-white/[0.06] text-zinc-100 hover:bg-white/[0.1]"
            >
              <Link to="/me">
                Account
                <UserRound className="size-4" />
              </Link>
            </Button>
          </div>
        </section>

        <form
          onSubmit={submitPrompt}
          className="rounded-lg border border-white/10 bg-[#101014]/90 p-3 shadow-2xl shadow-black/30 backdrop-blur"
        >
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask Lovable to create a product dashboard with a sleek auth flow..."
            className="min-h-32 resize-none border-white/10 bg-black/30 p-4 text-base text-white placeholder:text-zinc-600 focus-visible:border-fuchsia-300/50 focus-visible:ring-fuchsia-300/20"
          />

          <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {starters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => setPrompt(starter)}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
                >
                  {starter}
                </button>
              ))}
            </div>

            <Button className="h-10 bg-white text-black hover:bg-zinc-200">
              Generate
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </form>

        <section className="grid gap-4 lg:grid-cols-3">
          {projectCards.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="rounded-lg border-white/10 bg-white/[0.04] py-5 text-zinc-100 shadow-none"
              >
                <CardHeader className="px-5">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-white text-black">
                      <Icon className="size-4" />
                    </span>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 text-sm leading-6 text-zinc-400">
                  {item.description}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-fuchsia-300/15 text-fuchsia-100">
                <WandSparkles className="size-4" />
              </span>
              <div>
                <h2 className="font-medium text-white">Build queue</h2>
                <p className="text-sm text-zinc-500">No active generations.</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-medium text-white">Routes</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-400">
              <Link
                to="/signup"
                className="rounded-md border border-white/10 px-3 py-2 transition hover:text-white"
              >
                /signup
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-white/10 px-3 py-2 transition hover:text-white"
              >
                /login
              </Link>
              <Link
                to="/me"
                className="rounded-md border border-white/10 px-3 py-2 transition hover:text-white"
              >
                /me
              </Link>
              <Link
                to="/logout"
                className="rounded-md border border-white/10 px-3 py-2 transition hover:text-white"
              >
                /logout
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
