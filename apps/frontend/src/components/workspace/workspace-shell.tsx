import { useEffect, useRef, useState } from "react";
import { LoaderCircle, PanelLeft } from "lucide-react";
import { AccountPanel } from "@/components/workspace/account-panel";
import { ConversationView } from "@/components/workspace/conversation-view";
import { Sidebar } from "@/components/workspace/sidebar";
import { useRequireUser } from "@/hooks/use-current-user";
import { useWorkspace } from "@/lib/workspace";

export function WorkspaceShell() {
  const { data: user, isPending, isError } = useRequireUser();
  const {
    projects,
    conversations,
    activeConversationId,
    view,
    getConversation,
    conversationsByProject,
    createProject,
    createConversation,
    openConversation,
  } = useWorkspace();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bootstrapped = useRef(false);

  // On open, land in the most recent project with a ready-to-use chat. Reuse
  // an existing empty thread instead of piling up blank ones.
  useEffect(() => {
    if (bootstrapped.current || isPending || isError || !user) return;
    bootstrapped.current = true;

    const project = projects[0] ?? createProject("My project");
    const existing = conversationsByProject(project.id);
    const conversation =
      existing.find((c) => c.messages.length === 0) ??
      createConversation(project.id);
    openConversation(conversation.id);
  }, [
    user,
    isPending,
    isError,
    projects,
    conversationsByProject,
    createProject,
    createConversation,
    openConversation,
  ]);

  // If the active conversation is deleted, fall back to the most recent one.
  useEffect(() => {
    if (!bootstrapped.current || view !== "chat") return;
    if (activeConversationId && getConversation(activeConversationId)) return;

    const next = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt)[0];
    if (next) openConversation(next.id);
  }, [
    activeConversationId,
    conversations,
    view,
    getConversation,
    openConversation,
  ]);

  // Close the mobile drawer whenever the destination changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [activeConversationId, view]);

  if (isPending || isError || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const activeConversation = activeConversationId
    ? getConversation(activeConversationId)
    : undefined;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className="hidden w-[280px] shrink-0 border-r border-border lg:block">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[86%] max-w-[300px] border-r border-border bg-background shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {view === "account" ? (
          <AccountPanel onMenu={() => setSidebarOpen(true)} />
        ) : activeConversation ? (
          <ConversationView
            key={activeConversation.id}
            conversation={activeConversation}
            onMenu={() => setSidebarOpen(true)}
          />
        ) : (
          <EmptyState onMenu={() => setSidebarOpen(true)} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ onMenu }: { onMenu: () => void }) {
  const { createProject, createConversation, openConversation } = useWorkspace();

  function start() {
    const project = createProject("My project");
    const conversation = createConversation(project.id);
    openConversation(conversation.id);
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="flex h-14 shrink-0 items-center border-b border-border px-4 lg:hidden">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <PanelLeft className="size-4" />
        </button>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          No conversation open
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Create a project to start organizing your work into conversations.
        </p>
        <button
          type="button"
          onClick={start}
          className="mt-6 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          New project
        </button>
      </div>
    </section>
  );
}
