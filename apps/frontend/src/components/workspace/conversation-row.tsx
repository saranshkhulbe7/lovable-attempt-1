import { useState } from "react";
import { MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { InlineEdit } from "@/components/workspace/inline-edit";
import { conversationTitle, useWorkspace, type Conversation } from "@/lib/workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lovable/ui/components/dropdown-menu";
import { cn } from "@lovable/ui/lib/utils";

export function ConversationRow({ conversation }: { conversation: Conversation }) {
  const { activeConversationId, openConversation, renameConversation, deleteConversation } =
    useWorkspace();
  const [editing, setEditing] = useState(false);
  const active = activeConversationId === conversation.id;

  if (editing) {
    return (
      <div className="px-1.5 py-1">
        <InlineEdit
          initialValue={conversationTitle(conversation)}
          onCommit={(value) => {
            renameConversation(conversation.id, value);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="group/row relative">
      {active && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <button
        type="button"
        onClick={() => openConversation(conversation.id)}
        className={cn(
          "flex h-8 w-full items-center gap-2 rounded-md pl-3 pr-7 text-left transition-colors",
          active
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
        )}
      >
        <MessageSquare
          className={cn("size-3.5 shrink-0", active ? "text-primary" : "opacity-70")}
        />
        <span className="truncate font-mono text-[13px]">
          {conversationTitle(conversation)}
        </span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Conversation actions"
            className={cn(
              "absolute right-1 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-accent hover:text-foreground focus:opacity-100 group-hover/row:opacity-100 data-[state=open]:opacity-100",
            )}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem onSelect={() => setEditing(true)}>
            <Pencil className="size-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => {
              deleteConversation(conversation.id);
              toast.success("Conversation deleted");
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
