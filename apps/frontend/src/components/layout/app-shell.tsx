import type { ReactNode } from "react";
import {
  Boxes,
  ChevronRight,
  Home,
  LogOut,
  MessageSquareText,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useRequireUser } from "@/hooks/use-current-user";

import {
  Avatar,
  AvatarFallback,
  AvatarBadge,
} from "@lovable/ui/components/avatar";
import { Badge } from "@lovable/ui/components/badge";
import { Separator } from "@lovable/ui/components/separator";
import { cn } from "@lovable/ui/lib/utils";

const navItems = [
  {
    to: "/",
    label: "Workspace",
    icon: Home,
  },
  {
    to: "/me",
    label: "Account",
    icon: UserRound,
  },
];

function getInitial(email?: string) {
  return email?.charAt(0).toUpperCase() ?? "L";
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { data: user, isPending } = useRequireUser();

  return (
    <div className="min-h-screen bg-[#08080b] text-zinc-50">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(8,8,11,0.72),#08080b_78%)]" />

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-[#0c0c10]/90 p-4 backdrop-blur-xl lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-2 py-1">
          <span className="flex size-9 items-center justify-center rounded-lg bg-white text-black">
            <Boxes className="size-4" />
          </span>
          <div>
            <p className="font-semibold leading-none">Lovable</p>
            <p className="mt-1 text-xs text-zinc-500">Build workspace</p>
          </div>
        </Link>

        <Separator className="my-5 bg-white/10" />

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-10 items-center justify-between rounded-lg px-3 text-sm transition",
                  active
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                {active && <ChevronRight className="size-4" />}
              </Link>
            );
          })}

          <Link
            to="/"
            className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Plus className="size-4" />
            New project
          </Link>
        </nav>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <Badge className="border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
            <Sparkles className="size-3" />
            live preview
          </Badge>
          <p className="mt-3 text-sm text-zinc-300">
            Your auth session is backed by an HttpOnly cookie.
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <Avatar>
              <AvatarFallback className="bg-zinc-800 text-zinc-100">
                {getInitial(user?.email)}
              </AvatarFallback>
              <AvatarBadge className="bg-emerald-400 text-emerald-950" />
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-100">
                {isPending ? "Loading..." : user?.email}
              </p>
              <p className="text-xs text-zinc-500">Signed in</p>
            </div>
          </div>

          <Link
            to="/logout"
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut className="size-4" />
            Logout
          </Link>
        </div>
      </aside>

      <main className="relative z-10 lg:pl-72">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-[#08080b]/85 px-4 backdrop-blur lg:hidden">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white text-black">
              <Boxes className="size-4" />
            </span>
            Lovable
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex size-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white"
              aria-label="Workspace"
            >
              <MessageSquareText className="size-4" />
            </Link>
            <Link
              to="/me"
              className="flex size-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white"
              aria-label="Account"
            >
              <UserRound className="size-4" />
            </Link>
          </div>
        </header>

        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
