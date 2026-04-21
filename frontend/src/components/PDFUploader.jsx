import { useState, useRef } from "react";
import { UploadCloud, Plus, Loader2 } from "lucide-react";
import API from "../services/api";

export default function PDFUploader({ onUploaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/upload/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (typeof onUploaded === "function") {
        onUploaded(res.data.document || null);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to upload.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700/50 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 shadow-sm"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
        ) : (
          <Plus className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
        )}
        <span>{loading ? "Uploading..." : "New Chat"}</span>
      </button>

      {error && (
        <div className="mt-2 text-xs text-red-400 px-1">{error}</div>
      )}
    </div>
  );
}