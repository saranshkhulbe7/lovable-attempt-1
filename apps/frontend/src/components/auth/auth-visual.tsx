import { APP_NAME, APP_TAGLINE, Wordmark } from "@/components/logo";

type Line =
  | { kind: "prompt"; text: string }
  | { kind: "out"; text: string; accent?: boolean }
  | { kind: "gap" };

const transcript: Line[] = [
  { kind: "prompt", text: 'project new "Orbit API"' },
  { kind: "out", text: "created · 0 conversations" },
  { kind: "gap" },
  { kind: "prompt", text: "chat new" },
  { kind: "out", text: "agent ready — say what to build" },
  { kind: "gap" },
  { kind: "prompt", text: "add a token-bucket rate limiter" },
  { kind: "out", text: "↳ drafting middleware/limit.ts" },
  { kind: "out", text: "↳ 1 file changed · ready to review", accent: true },
];

export function AuthVisual() {
  return (
    <div className="relative hidden h-full overflow-hidden border-r border-border bg-background lg:block">
      {/* atmosphere: blueprint grid + a single warm light source */}
      <div className="bg-grid absolute inset-0 opacity-70" />
      <div className="absolute -left-24 -top-24 size-[34rem] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
        <Wordmark />

        <div className="max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground xl:text-5xl">
            Projects hold the work.
            <br />
            <span className="text-muted-foreground">
              Conversations move it forward.
            </span>
          </h1>

          {/* signature element: a live-looking agent transcript */}
          <div className="mt-9 overflow-hidden rounded-lg border border-border bg-card/70 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span className="size-1.5 rounded-full bg-primary/80" />
              <span className="font-mono text-xs text-muted-foreground">
                {APP_NAME.toLowerCase()} — workspace
              </span>
            </div>
            <div className="space-y-1 p-4 font-mono text-[13px] leading-relaxed">
              {transcript.map((line, i) => {
                if (line.kind === "gap") {
                  return <div key={i} className="h-2" aria-hidden />;
                }
                if (line.kind === "prompt") {
                  return (
                    <div key={i} className="flex gap-2.5 text-foreground">
                      <span className="select-none text-primary">❯</span>
                      <span>{line.text}</span>
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className={
                      line.accent
                        ? "pl-[1.4rem] text-primary"
                        : "pl-[1.4rem] text-muted-foreground"
                    }
                  >
                    {line.text}
                  </div>
                );
              })}
              <div className="flex gap-2.5 pt-1 text-foreground">
                <span className="select-none text-primary">❯</span>
                <span className="inline-block h-[1.1em] w-[7px] translate-y-[2px] bg-foreground/80 animate-caret" />
              </div>
            </div>
          </div>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {APP_TAGLINE}
        </p>
      </div>
    </div>
  );
}
