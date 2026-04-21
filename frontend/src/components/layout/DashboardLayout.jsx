import TopNavbar from "./TopNavbar";

export default function DashboardLayout({
  sidebar,
  main,
  sidebarCollapsed,
  onToggleSidebar,
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <TopNavbar onToggleSidebar={onToggleSidebar} sidebarCollapsed={sidebarCollapsed} />

      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-4 p-4 lg:grid-cols-[auto,1fr]">
        <aside
          className={
            "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30 " +
            (sidebarCollapsed ? "lg:w-16" : "lg:w-80")
          }
        >
          {sidebar}
        </aside>

        <main className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30">
          {main}
        </main>
      </div>
    </div>
  );
}
