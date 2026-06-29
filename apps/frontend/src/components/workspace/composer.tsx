import { useRef, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@lovable/ui/components/button";
import { cn } from "@lovable/ui/lib/utils";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export function Composer({
  value,
  onChange,
  onSubmit,
  disabled,
  autoFocus,
  placeholder = "Describe a task, or ask the agent a question…",
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !disabled;

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      if (canSend) onSubmit();
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-end gap-2 rounded-xl border border-border bg-card px-3 py-2.5",
          "shadow-lg shadow-black/20 transition-colors",
          "focus-within:border-primary/60 focus-within:ring-[3px] focus-within:ring-primary/15",
        )}
        onClick={() => textareaRef.current?.focus()}
      >
        <span
          aria-hidden
          className="select-none pb-1.5 font-mono text-base leading-none text-primary"
        >
          ❯
        </span>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          autoFocus={autoFocus}
          className={cn(
            "field-sizing-content max-h-52 min-h-7 w-full resize-none bg-transparent py-1 text-[15px] leading-relaxed text-foreground outline-none",
            "placeholder:text-muted-foreground",
          )}
        />

        <Button
          type="button"
          size="icon"
          onClick={() => canSend && onSubmit()}
          disabled={!canSend}
          aria-label="Send message"
          className="size-8 rounded-lg"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>

      <p className="mt-2 px-1 font-mono text-xs text-muted-foreground">
        <kbd className="font-sans">Enter</kbd> to send ·{" "}
        <kbd className="font-sans">Shift</kbd>+<kbd className="font-sans">Enter</kbd>{" "}
        for a new line
      </p>
    </div>
  );
}
