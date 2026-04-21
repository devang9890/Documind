import { useEffect, useMemo, useRef, useState } from "react";

import Spinner from "../ui/Spinner";

function Bubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={"flex w-full " + (isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={
          "max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm sm:max-w-[75%] " +
          (isUser
            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
            : "bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100")
        }
      >
        <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
      </div>
    </div>
  );
}

export default function ChatPanel({
  selectedDocument,
  messages,
  loading,
  error,
  onSend,
  onClear,
}) {
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  const canSend = useMemo(() => {
    return !loading && input.trim().length > 0 && Boolean(selectedDocument);
  }, [loading, input, selectedDocument]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    await onSend(text);
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] min-h-130 flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Chat</div>
          <div className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
            {selectedDocument ? (
              <>
                Active document: <span className="font-medium">{selectedDocument.filename}</span>
              </>
            ) : (
              "Select a document from the sidebar"
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
          disabled={messages.length === 0 && !input}
        >
          Clear chat
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {messages.length === 0 ? (
          <div className="mx-auto mt-10 max-w-xl text-center">
            <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Ask questions about your PDF
            </div>
            <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Upload or select a document, then ask anything — definitions, summaries, explanations, and more.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} content={m.content} />
            ))}

            {loading && (
              <div className="pt-2">
                <Spinner label="DocuMind is thinking…" />
              </div>
            )}

            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder={
              selectedDocument
                ? "Type a question… (Enter to send, Shift+Enter for new line)"
                : "Select a document to start chatting…"
            }
            disabled={!selectedDocument}
            rows={2}
            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100/10 dark:disabled:bg-zinc-950"
          />

          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!canSend}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Send
          </button>
        </div>

        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {selectedDocument ? "Answers are generated from your selected PDF." : "No document selected."}
        </div>
      </div>
    </div>
  );
}
