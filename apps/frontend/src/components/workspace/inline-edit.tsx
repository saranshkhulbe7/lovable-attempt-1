import { useEffect, useRef, useState } from "react";
import { cn } from "@lovable/ui/lib/utils";

/** A borderless inline text editor used for renaming projects and conversations. */
export function InlineEdit({
  initialValue,
  onCommit,
  onCancel,
  className,
}: {
  initialValue: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
  className?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  function commit() {
    const trimmed = value.trim();
    if (trimmed) onCommit(trimmed);
    else onCancel();
  }

  return (
    <input
      ref={ref}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        } else if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      }}
      className={cn(
        "w-full rounded-[5px] border border-primary/60 bg-background px-1.5 py-0.5 font-mono text-[13px] text-foreground outline-none ring-[3px] ring-primary/15",
        className,
      )}
    />
  );
}
