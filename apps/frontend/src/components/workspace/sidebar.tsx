import { useState } from "react";
import {
  ChevronDown,
  LogOut,
  Plus,
  SquarePen,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Wordmark } from "@/components/logo";
import { InlineEdit } from "@/components/workspace/inline-edit";
import { ProjectItem } from "@/components/workspace/project-item";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useWorkspace } from "@/lib/workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lovable/ui/components/dropdown-menu";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const {
    projects,
    activeConversationId,
    getConversation,
    createProject,
    createConversation,
    openConversation,
    setView,
  } = useWorkspace();
  const { data: user } = useCurrentUser();
  const [creatingProject, setCreatingProject] = useState(false);

  const activeConversation = activeConversationId
    ? getConversation(activeConversationId)
    : undefined;

  function newChat() {
    const targetProjectId = activeConversation?.projectId ?? projects[0]?.id;
    const project = targetProjectId
      ? { id: targetProjectId }
      : createProject();
    const conversation = createConversation(project.id);
    openConversation(conversation.id);
  }

  function confirmNewProject(name: string) {
    const project = createProject(name);
    const conversation = createConversation(project.id);
    openConversation(conversation.id);
    setCreatingProject(false);
  }

  return (
    <div className="flex h-full flex-col bg-card/40">
      <div className="flex h-14 items-center justify-between px-3">
        <button
          type="button"
          onClick={() => setView("chat")}
          className="rounded-md px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Wordmark />
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={newChat}
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
        >
          <SquarePen className="size-4 text-muted-foreground" />
          New chat
        </button>
      </div>

      <div className="flex items-center justify-between px-4 pb-1 pt-2">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Projects
        </span>
        <button
          type="button"
          onClick={() => setCreatingProject(true)}
          aria-label="New project"
          title="New project"
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
        {creatingProject && (
          <div className="px-1.5 py-1">
            <InlineEdit
              initialValue="New project"
              onCommit={confirmNewProject}
              onCancel={() => setCreatingProject(false)}
            />
          </div>
        )}

        {projects.length === 0 && !creatingProject ? (
          <button
            type="button"
            onClick={() => setCreatingProject(true)}
            className="mt-1 flex w-full flex-col items-start gap-1 rounded-lg border border-dashed border-border px-3 py-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/50"
          >
            <span className="text-sm font-medium text-foreground">
              Create a project
            </span>
            <span className="text-xs text-muted-foreground">
              Group related conversations together.
            </span>
          </button>
        ) : (
          projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))
        )}
      </nav>

      <div className="border-t border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary font-mono text-xs font-medium text-foreground">
                {user?.email?.charAt(0).toUpperCase() ?? "·"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-foreground">
                  {user?.email ?? "Loading…"}
                </span>
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-[15rem]">
            <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setView("account")}>
              <UserRound className="size-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem asChild variant="destructive">
              <Link to="/logout">
                <LogOut className="size-4" />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
