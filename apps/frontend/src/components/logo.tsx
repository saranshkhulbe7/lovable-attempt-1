import { cn } from "@lovable/ui/lib/utils";

export const APP_NAME = "Saransh";
export const APP_TAGLINE = "Coding agent workspace";

/**
 * The mark is the prompt glyph itself — the same `❯` that opens the composer,
 * so the brand and the place you type are visibly the same idea.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary font-mono text-[15px] leading-none text-primary",
        className,
      )}
    >
      ❯
    </span>
  );
}

export function Wordmark({
  className,
  withMark = true,
}: {
  className?: string;
  withMark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {withMark && <LogoMark />}
      <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
        {APP_NAME}
      </span>
    </span>
  );
}
