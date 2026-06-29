import { useEffect, useRef, useState } from "react";
import { PanelLeft } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { Composer } from "@/components/workspace/composer";
import { requestAssistantReply } from "@/lib/assistant";
import {
  conversationTitle,
  useWorkspace,
  type Conversation,
  type Message,
} from "@/lib/workspace";
import { cn } from "@lovable/ui/lib/utils";

const examplePrompts = [
  "Scaffold a REST endpoint with input validation",
  "Write tests for the auth flow",
  "Refactor this function to be pure",
  "Explain this stack trace",
];

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConversationView({
  conversation,
  onMenu,
}: {
  conversation: Conversation;
  onMenu?: () => void;
}) {
  const { addMessage, projects } = useWorkspace();
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const mounted = useRef(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const project = projects.find((p) => p.id === conversation.projectId);
  const messages = conversation.messages;
  const isEmpty = messages.length === 0;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, thinking]);

  async function send() {
    const text = draft.trim();
    if (!text || thinking) return;

    setDraft("");
    addMessage(conversation.id, "user", text);

    const priorAssistant = messages.filter((m) => m.role === "assistant").length;
    setThinking(true);

    const reply = await requestAssistantReply(text, priorAssistant);
    addMessage(conversation.id, "assistant", reply);
    if (mounted.current) setThinking(false);
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 sm:px-8">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            aria-label="Open menu"
            className="-ml-1 mr-1 flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <PanelLeft className="size-4" />
          </button>
        )}
        <span className="truncate font-mono text-sm text-muted-foreground">
          {project?.name ?? "Project"}
        </span>
        <span className="text-muted-foreground/50">/</span>
        <span className="truncate font-mono text-sm text-foreground">
          {conversationTitle(conversation)}
        </span>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 text-center">
            <LogoMark className="size-10 text-lg" />
            <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground">
              What are we building?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Describe a task and the agent picks it up in this thread.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setDraft(prompt)}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-7 px-5 py-8 sm:px-8">
            {messages.map((message) => (
              <MessageRow key={message.id} message={message} />
            ))}
            {thinking && <ThinkingRow />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 px-5 pb-5 sm:px-8 sm:pb-6">
        <div className="mx-auto max-w-3xl">
          <Composer
            value={draft}
            onChange={setDraft}
            onSubmit={send}
            disabled={thinking}
            autoFocus
          />
        </div>
      </div>
    </section>
  );
}

function MessageRow({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <article
      className={cn(
        "group animate-rise border-l-2 pl-4",
        isUser ? "border-border" : "border-primary/50",
      )}
    >
      <header className="mb-2 flex items-center gap-2">
        {isUser ? (
          <span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            you
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            agent
          </span>
        )}
        <time className="font-mono text-xs text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
          {formatTime(message.createdAt)}
        </time>
      </header>
      <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
        {message.content}
      </div>
    </article>
  );
}

function ThinkingRow() {
  return (
    <div className="animate-rise border-l-2 border-primary/50 pl-4">
      <div className="mb-2 flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary">
        <span className="size-1.5 rounded-full bg-primary" />
        agent
      </div>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
