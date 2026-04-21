import PDFUploader from "../PDFUploader";

export default function DocumentsSidebar({
  collapsed,
  documents,
  selectedDocumentId,
  search,
  onSearchChange,
  onSelect,
  onDelete,
  onUploaded,
  loading,
  error,
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 p-3 dark:border-zinc-800">
        <div className={"flex items-center justify-between gap-2 " + (collapsed ? "justify-center" : "")}
        >
          {!collapsed && (
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Documents</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Select a PDF to chat</div>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="mt-3 space-y-3">
            <PDFUploader onUploaded={onUploaded} compact />

            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100/10"
            />
          </div>
        )}
      </div>

      <div className={"flex-1 overflow-auto p-2 " + (collapsed ? "p-2" : "p-3")}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">PDFs</div>
          </div>
        ) : (
          <>
            {loading && (
              <div className="py-6 text-sm text-zinc-500 dark:text-zinc-400">Loading documents…</div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            )}

            {!loading && !error && documents.length === 0 && (
              <div className="py-8 text-center">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No documents yet</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Upload a PDF to start chatting.
                </div>
              </div>
            )}

            <ul className="space-y-2">
              {documents.map((doc) => {
                const selected = doc.id === selectedDocumentId;
                return (
                  <li key={doc.id}>
                    <div
                      className={
                        "group flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition " +
                        (selected
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                          : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900")
                      }
                    >
                      <button
                        type="button"
                        onClick={() => onSelect(doc)}
                        className="min-w-0 flex-1 text-left"
                        title={doc.filename}
                      >
                        <div className="truncate text-sm font-medium">{doc.filename}</div>
                        <div
                          className={
                            "truncate text-xs " +
                            (selected
                              ? "text-white/80 dark:text-zinc-700"
                              : "text-zinc-500 dark:text-zinc-400")
                          }
                        >
                          {doc.created_at ? new Date(doc.created_at).toLocaleString() : ""}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(doc)}
                        className={
                          "rounded-lg px-2 py-1 text-xs font-medium opacity-0 transition group-hover:opacity-100 " +
                          (selected
                            ? "bg-white/15 text-white hover:bg-white/25 dark:bg-zinc-900/10 dark:text-zinc-900 dark:hover:bg-zinc-900/20"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800")
                        }
                        aria-label={`Delete ${doc.filename}`}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
