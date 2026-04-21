import { useAuth } from "../../context/AuthContext";

export default function TopNavbar({ onToggleSidebar, sidebarCollapsed }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-3 px-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand" : "Collapse"}
        >
          <span className="text-lg leading-none">≡</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            <span className="text-sm font-semibold">DM</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">DocuMind AI</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">PDF RAG Dashboard</div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user?.name || "User"}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{user?.email}</div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
