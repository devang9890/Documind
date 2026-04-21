import { BookOpen, LogOut, MessageSquare, Trash2, Search, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PDFUploader from "../PDFUploader";

export default function DocumentsSidebar({
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
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-[#09090b] text-zinc-300">
      
      {/* 1. App Branding */}
      <div className="hidden lg:flex items-center gap-3 p-5 pb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          <BookOpen className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-wide text-zinc-100">DocuMind AI</h1>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">AI Study Assistant</p>
        </div>
      </div>

      {/* 2. Actions & Search */}
      <div className="px-3 pt-4 pb-2 space-y-3">
        <PDFUploader onUploaded={onUploaded} />

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-700 hover:border-zinc-700/80 focus:bg-zinc-900 focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* 3. Document/Chat List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 pt-4 hide-scrollbar mask-image-bottom custom-scroll-area">
        <div className="px-2 mb-2">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Your Notes</h2>
        </div>

        {loading && (
          <div className="px-2 py-4">
            <div className="flex items-center justify-center space-x-2 animate-pulse">
              <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
              <div className="w-2 h-2 bg-zinc-600 rounded-full animation-delay-200"></div>
              <div className="w-2 h-2 bg-zinc-600 rounded-full animation-delay-400"></div>
            </div>
            <p className="text-center text-xs text-zinc-500 mt-2">Loading documents...</p>
          </div>
        )}

        {!loading && error && (
          <div className="mx-2 rounded-lg border border-red-900/40 bg-red-950/20 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && documents.length === 0 && (
          <div className="px-4 py-8 text-center bg-zinc-900/20 rounded-xl mx-2 border border-zinc-800/30 border-dashed mt-2">
            <FileText className="h-6 w-6 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-zinc-300">No notes yet</p>
            <p className="text-xs text-zinc-500 mt-1">Upload a PDF to start studying.</p>
          </div>
        )}

        <ul className="space-y-1 pb-4">
          {documents.map((doc) => {
            const selected = doc.id === selectedDocumentId;
            return (
              <li key={doc.id}>
                <div
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 cursor-pointer ${
                    selected
                      ? "bg-zinc-800 text-zinc-100 font-medium"
                      : "text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
                  }`}
                  onClick={() => onSelect(doc)}
                >
                  <MessageSquare className={`h-4 w-4 shrink-0 ${selected ? "text-white" : "text-zinc-500 group-hover:text-zinc-400"}`} />
                  
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="truncate">{doc.filename}</div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(doc);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-700 hover:text-red-400 transition-all duration-200"
                    title="Delete document"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 4. User Section (Sticky Bottom) */}
      <div className="border-t border-zinc-800/60 p-3 bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-zinc-900/80 transition-colors w-full group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 text-zinc-100 uppercase font-semibold shrink-0 ring-2 ring-zinc-800 group-hover:ring-zinc-700 transition-all">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-200 truncate">{user?.name || "Student"}</p>
            <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
