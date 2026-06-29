import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  projectId: string;
  /** null until the first message names it, or the user renames it. */
  title: string | null;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  collapsed: boolean;
  createdAt: number;
  updatedAt: number;
}

interface WorkspaceData {
  projects: Project[];
  conversations: Conversation[];
  lastActiveAt: number;
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "saransh.workspace.v1";

function emptyData(): WorkspaceData {
  return { projects: [], conversations: [], lastActiveAt: 0 };
}

function loadData(): WorkspaceData {
  if (typeof window === "undefined") return emptyData();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();

    const parsed = JSON.parse(raw) as Partial<WorkspaceData>;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      conversations: Array.isArray(parsed.conversations)
        ? parsed.conversations
        : [],
      lastActiveAt: typeof parsed.lastActiveAt === "number" ? parsed.lastActiveAt : 0,
    };
  } catch {
    return emptyData();
  }
}

function saveData(data: WorkspaceData) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or unavailable — keep the session in memory */
  }
}

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

type Action =
  | { type: "add_project"; project: Project }
  | { type: "rename_project"; id: string; name: string }
  | { type: "delete_project"; id: string }
  | { type: "toggle_project"; id: string; collapsed?: boolean }
  | { type: "add_conversation"; conversation: Conversation }
  | { type: "rename_conversation"; id: string; title: string }
  | { type: "delete_conversation"; id: string }
  | { type: "add_message"; conversationId: string; message: Message }
  | { type: "touch" };

function reducer(state: WorkspaceData, action: Action): WorkspaceData {
  const now = Date.now();

  switch (action.type) {
    case "add_project":
      return {
        ...state,
        projects: [action.project, ...state.projects],
        lastActiveAt: now,
      };

    case "rename_project":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id
            ? { ...p, name: action.name.trim() || p.name, updatedAt: now }
            : p,
        ),
      };

    case "delete_project":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.id),
        conversations: state.conversations.filter(
          (c) => c.projectId !== action.id,
        ),
      };

    case "toggle_project":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id
            ? { ...p, collapsed: action.collapsed ?? !p.collapsed }
            : p,
        ),
      };

    case "add_conversation":
      return {
        ...state,
        conversations: [action.conversation, ...state.conversations],
        projects: state.projects.map((p) =>
          p.id === action.conversation.projectId
            ? { ...p, updatedAt: now }
            : p,
        ),
        lastActiveAt: now,
      };

    case "rename_conversation":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.id
            ? { ...c, title: action.title.trim() || c.title, updatedAt: now }
            : c,
        ),
      };

    case "delete_conversation":
      return {
        ...state,
        conversations: state.conversations.filter((c) => c.id !== action.id),
      };

    case "add_message": {
      let projectId: string | null = null;

      const conversations = state.conversations.map((c) => {
        if (c.id !== action.conversationId) return c;
        projectId = c.projectId;
        const title =
          c.title ??
          (action.message.role === "user"
            ? deriveTitle(action.message.content)
            : null);
        return {
          ...c,
          title,
          messages: [...c.messages, action.message],
          updatedAt: now,
        };
      });

      return {
        ...state,
        conversations,
        projects: state.projects.map((p) =>
          p.id === projectId ? { ...p, updatedAt: now } : p,
        ),
        lastActiveAt: now,
      };
    }

    case "touch":
      return { ...state, lastActiveAt: now };

    default:
      return state;
  }
}

export function deriveTitle(text: string) {
  const firstLine = text.trim().split("\n")[0]?.trim() ?? "";
  if (!firstLine) return "New chat";
  return firstLine.length > 42 ? `${firstLine.slice(0, 42).trimEnd()}…` : firstLine;
}

export function conversationTitle(conversation: Conversation) {
  return conversation.title ?? "New chat";
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

export type WorkspaceView = "chat" | "account";

interface WorkspaceContextValue {
  projects: Project[];
  conversations: Conversation[];
  activeConversationId: string | null;
  view: WorkspaceView;
  setView: (view: WorkspaceView) => void;
  openConversation: (id: string) => void;

  createProject: (name?: string) => Project;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  toggleProject: (id: string, collapsed?: boolean) => void;

  createConversation: (projectId: string) => Conversation;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;

  addMessage: (conversationId: string, role: MessageRole, content: string) => void;

  conversationsByProject: (projectId: string) => Conversation[];
  getConversation: (id: string) => Conversation | undefined;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadData);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [view, setView] = useState<WorkspaceView>("chat");

  useEffect(() => {
    saveData(state);
  }, [state]);

  const createProject = useCallback((name?: string) => {
    const now = Date.now();
    const count = loadData().projects.length;
    const project: Project = {
      id: uid(),
      name: name?.trim() || `Project ${count + 1}`,
      collapsed: false,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: "add_project", project });
    return project;
  }, []);

  const renameProject = useCallback((id: string, name: string) => {
    dispatch({ type: "rename_project", id, name });
  }, []);

  const deleteProject = useCallback((id: string) => {
    dispatch({ type: "delete_project", id });
  }, []);

  const toggleProject = useCallback((id: string, collapsed?: boolean) => {
    dispatch({ type: "toggle_project", id, collapsed });
  }, []);

  const createConversation = useCallback((projectId: string) => {
    const now = Date.now();
    const conversation: Conversation = {
      id: uid(),
      projectId,
      title: null,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: "add_conversation", conversation });
    return conversation;
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    dispatch({ type: "rename_conversation", id, title });
  }, []);

  const deleteConversation = useCallback((id: string) => {
    dispatch({ type: "delete_conversation", id });
  }, []);

  const addMessage = useCallback(
    (conversationId: string, role: MessageRole, content: string) => {
      const message: Message = {
        id: uid(),
        role,
        content,
        createdAt: Date.now(),
      };
      dispatch({ type: "add_message", conversationId, message });
    },
    [],
  );

  const openConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setView("chat");
  }, []);

  const conversationsByProject = useCallback(
    (projectId: string) =>
      state.conversations
        .filter((c) => c.projectId === projectId)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [state.conversations],
  );

  const getConversation = useCallback(
    (id: string) => state.conversations.find((c) => c.id === id),
    [state.conversations],
  );

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      projects: [...state.projects].sort((a, b) => b.updatedAt - a.updatedAt),
      conversations: state.conversations,
      activeConversationId,
      view,
      setView,
      openConversation,
      createProject,
      renameProject,
      deleteProject,
      toggleProject,
      createConversation,
      renameConversation,
      deleteConversation,
      addMessage,
      conversationsByProject,
      getConversation,
    }),
    [
      state.projects,
      state.conversations,
      activeConversationId,
      view,
      openConversation,
      createProject,
      renameProject,
      deleteProject,
      toggleProject,
      createConversation,
      renameConversation,
      deleteConversation,
      addMessage,
      conversationsByProject,
      getConversation,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return ctx;
}
