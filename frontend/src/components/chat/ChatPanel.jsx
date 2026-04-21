import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, UploadCloud, BrainCircuit, Sparkles, BookOpen, GraduationCap, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Bubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mr-3 mt-1 shadow-sm">
          <BrainCircuit className="h-4 w-4 text-zinc-300" />
        </div>
      )}
      
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm text-[15px] leading-relaxed ${
          isUser
            ? "bg-zinc-100 text-zinc-900 rounded-tr-sm"
            : "bg-zinc-800/80 border border-zinc-700/50 text-zinc-200 rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center ml-3 mt-1 shadow-sm">
          <span className="text-white text-xs font-semibold">U</span>
        </div>
      )}
    </div>
  );
}

const SUGGESTIONS = [
  { icon: <BookOpen className="w-4 h-4" />, text: "Summarize this chapter" },
  { icon: <GraduationCap className="w-4 h-4" />, text: "Explain in simple words" },
  { icon: <Sparkles className="w-4 h-4" />, text: "Create quiz from notes" },
  { icon: <BrainCircuit className="w-4 h-4" />, text: "Give viva questions" },
];

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
  const textareaRef = useRef(null);

  const canSend = useMemo(() => {
    return !loading && input.trim().length > 0 && Boolean(selectedDocument);
  }, [loading, input, selectedDocument]);

  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text || !selectedDocument || loading) return;
    
    setInput("");
    
    // Reset textarea height after send
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    
    await onSend(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-zinc-100 overflow-hidden relative shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20 rounded-tl-2xl border-t border-l border-zinc-800/80">
      
      {/* Top Bar */}
      <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center min-w-0">
          <div className="mr-3 p-1.5 bg-zinc-800/50 rounded-lg hidden sm:block">
            <FileText className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-zinc-100 truncate">
              {selectedDocument ? selectedDocument.filename : "No doc selected"}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[11px] font-medium text-zinc-400 capitalize">AI Tutor Ready</span>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-700"
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-12 py-8 custom-scroll-area relative">
        <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-xl mb-6"
              >
                <BrainCircuit className="h-8 w-8 text-zinc-300" />
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-semibold mb-2"
              >
                What would you like to learn?
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-500 mb-10 text-center max-w-sm"
              >
                Upload notes and ask me to summarize chapters, explain complex topics, or generate practice quizzes.
              </motion.p>
              
              {selectedDocument && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
                >
                  {SUGGESTIONS.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion.text)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left text-sm text-zinc-300 hover:text-white group"
                    >
                      <div className="p-2 bg-zinc-800 group-hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 group-hover:text-white">
                        {suggestion.icon}
                      </div>
                      <span className="font-medium">{suggestion.text}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex flex-col flex-1 pb-10">
              {messages.map((m) => (
                <Bubble key={m.id} role={m.role} content={m.content} />
              ))}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex w-full justify-start mb-6"
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mr-3 mt-1">
                    <BrainCircuit className="h-4 w-4 text-zinc-300" />
                  </div>
                  <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </motion.div>
              )}
              
              <div ref={endRef} className="h-4 w-full" />
            </div>
          )}
        </div>
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="flex-shrink-0 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-6 pb-6 px-4 sm:px-6 lg:px-12 pointer-events-none sticky bottom-0 z-10 w-full mb-0 lg:mb-2">
        <div className="max-w-3xl mx-auto w-full relative pointer-events-auto">
          
          {error && (
            <div className="absolute -top-14 left-0 right-0 mx-auto w-fit max-w-sm rounded-lg border border-red-900/50 bg-red-950/80 backdrop-blur px-4 py-2 text-xs text-red-300 shadow-xl">
              {error}
            </div>
          )}

          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedDocument
                  ? "Ask your notes anything..."
                  : "Select a document to start studying..."
              }
              disabled={!selectedDocument}
              rows={1}
              className="w-full resize-none rounded-2xl border border-zinc-700 focus:border-zinc-500 bg-zinc-900/80 backdrop-blur-md pl-4 pr-14 py-4 text-[15px] leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-4 focus:ring-zinc-800/30 disabled:cursor-not-allowed disabled:bg-zinc-900/40 disabled:border-zinc-800 shadow-lg transition-all duration-200 hide-scrollbar"
              style={{ minHeight: '56px', maxHeight: '200px' }}
            />

            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!canSend}
              className={`absolute right-2.5 bottom-2.5 h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                canSend 
                  ? "bg-zinc-100 text-zinc-900 hover:bg-white shadow-md"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          
          <div className="mt-3 text-center text-[10px] text-zinc-500">
            AI can make mistakes. Consider verifying important information from original notes.
          </div>
        </div>
      </div>
      
    </div>
  );
}

// Ensure icon import 
import { FileText } from "lucide-react";
