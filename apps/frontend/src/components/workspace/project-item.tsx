import { useState } from "react";
import {
  ChevronRight,
  Folder,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ConversationRow } from "@/components/workspace/conversation-row";
import { InlineEdit } from "@/components/workspace/inline-edit";
import { useWorkspace, type Project } from "@/lib/workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lovable/ui/components/dropdown-menu";
import { cn } from "@lovable/ui/lib/utils";

export function ProjectItem({ project }: { project: Project }) {
  const {
    conversationsByProject,
    createConversation,
    openConversation,
    toggleProject,
    renameProject,
    deleteProject,
  } = useWorkspace();
  const [editing, setEditing] = useState(false);

  const conversations = conversationsByProject(project.id);
  const expanded = !project.collapsed;

  function addChat() {
    toggleProject(project.id, false);
    const conversation = createConversation(project.id);
    openConversation(conversation.id);
  }

  return (
    <div>
      <div className="group/proj relative flex items-center">
        {editing ? (
          <div className="flex-1 px-2 py-1">
            <InlineEdit
              initialValue={project.name}
              onCommit={(value) => {
                renameProject(project.id, value);
                setEditing(false);
              }}
              onCancel={() => setEditing(false)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => toggleProject(project.id)}
            className="flex h-8 flex-1 items-center gap-1.5 rounded-md pl-1.5 pr-14 text-left text-foreground transition-colors hover:bg-accent/60"
          >
            <ChevronRight
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground transition-transform",
                expanded && "rotate-90",
              )}
            />
            <Folder className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate font-mono text-[13px] font-medium">
              {project.name}
            </span>
          </button>
        )}

        {!editing && (
          <div className="absolute right-1 flex items-center opacity-0 transition group-hover/proj:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={addChat}
              aria-label="New chat in project"
              title="New chat"
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Plus className="size-4" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Project actions"
                  className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground data-[state=open]:opacity-100"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuItem onSelect={addChat}>
                  <Plus className="size-4" />
                  New chat
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setEditing(true)}>
                  <Pencil className="size-4" />
                  Rename project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => {
                    deleteProject(project.id);
                    toast.success("Project deleted");
                  }}
                >
                  <Trash2 className="size-4" />
                  Delete project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {expanded && (
        <div className="mb-1 mt-0.5 space-y-0.5 pl-3">
          {conversations.length === 0 ? (
            <button
              type="button"
              onClick={addChat}
              className="flex h-8 w-full items-center gap-2 rounded-md pl-3 text-left font-mono text-[13px] text-muted-foreground/70 transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              <Plus className="size-3.5" />
              New chat
            </button>
          ) : (
            conversations.map((conversation) => (
              <ConversationRow key={conversation.id} conversation={conversation} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
