import { CalendarClock, Fingerprint, Mail, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useCurrentUser } from "@/hooks/use-current-user";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
} from "@lovable/ui/components/avatar";
import { Badge } from "@lovable/ui/components/badge";

function getInitial(email?: string) {
  return email?.charAt(0).toUpperCase() ?? "L";
}

export default function MePage() {
  const { data: user, isPending } = useCurrentUser();

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-6 pt-4 sm:pt-8">
        <div>
          <Badge className="border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
            <ShieldCheck className="size-3" />
            authenticated
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white">
            Account
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Your current `/me` session data from the backend.
          </p>
        </div>

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarFallback className="bg-zinc-800 text-base text-zinc-100">
                  {getInitial(user?.email)}
                </AvatarFallback>
                <AvatarBadge className="bg-emerald-400 text-emerald-950" />
              </Avatar>
              <div>
                <p className="text-lg font-medium text-white">
                  {isPending ? "Loading..." : user?.email}
                </p>
                <p className="text-sm text-zinc-500">Lovable workspace user</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <Mail className="size-5 text-fuchsia-200" />
            <p className="mt-4 text-sm text-zinc-500">Email</p>
            <p className="mt-1 break-all font-medium text-white">
              {user?.email ?? "Loading..."}
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <Fingerprint className="size-5 text-cyan-200" />
            <p className="mt-4 text-sm text-zinc-500">User ID</p>
            <p className="mt-1 break-all font-medium text-white">
              {user?.id ?? "Loading..."}
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <CalendarClock className="size-5 text-emerald-200" />
            <p className="mt-4 text-sm text-zinc-500">Session</p>
            <p className="mt-1 font-medium text-white">Cookie authenticated</p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
