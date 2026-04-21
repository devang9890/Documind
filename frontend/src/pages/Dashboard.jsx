import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

import DashboardLayout from "../components/layout/DashboardLayout";
import DocumentsSidebar from "../components/documents/DocumentsSidebar";
import ChatPanel from "../components/chat/ChatPanel";

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return String(Date.now()) + Math.random().toString(16).slice(2);
}

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [docsError, setDocsError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedDocument, setSelectedDocument] = useState(null);

  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const filteredDocuments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((d) => (d.filename || "").toLowerCase().includes(q));
  }, [documents, search]);

  const fetchDocuments = async (q) => {
    setDocsError("");
    setDocsLoading(true);
    try {
      const res = await API.get("/upload/documents", {
        params: q ? { q } : undefined,
      });
      setDocuments(res.data.documents || []);
    } catch (err) {
      setDocsError(err?.response?.data?.detail || "Failed to load documents.");
    } finally {
      setDocsLoading(false);
    }
  };

  useEffect(() => {
    void fetchDocuments("");
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      void fetchDocuments(search.trim());
    }, 250);
    return () => clearTimeout(handle);
  }, [search]);

  const handleSelectDocument = (doc) => {
    setSelectedDocument(doc);
    setMessages([]);
    setChatError("");
  };

  const handleDeleteDocument = async (doc) => {
    const ok = window.confirm(`Delete ${doc.filename}? This cannot be undone.`);
    if (!ok) return;

    setDocsError("");
    try {
      await API.delete(`/upload/documents/${doc.id}`);
      await fetchDocuments(search.trim());

      if (selectedDocument?.id === doc.id) {
        setSelectedDocument(null);
        setMessages([]);
        setChatError("");
      }
    } catch (err) {
      setDocsError(err?.response?.data?.detail || "Failed to delete document.");
    }
  };

  const handleUploaded = async (uploadedDoc) => {
    await fetchDocuments(search.trim());

    if (uploadedDoc?.id) {
      setSelectedDocument({ id: uploadedDoc.id, filename: uploadedDoc.filename });
      setMessages([]);
      setChatError("");
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setChatError("");
  };

  const handleSend = async (text) => {
    if (!selectedDocument) {
      setChatError("Select a document first.");
      return;
    }

    setChatError("");
    setChatLoading(true);

    const userMessage = { id: newId(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await API.post("/chat/ask", {
        question: text,
        document_id: selectedDocument.id,
      });

      const assistantMessage = {
        id: newId(),
        role: "assistant",
        content: res.data.answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const detail = err?.response?.data?.detail || "Failed to get an answer.";
      setChatError(detail);

      const assistantMessage = {
        id: newId(),
        role: "assistant",
        content: `**Error:** ${detail}`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <DashboardLayout
      sidebar={
        <DocumentsSidebar
          documents={filteredDocuments}
          selectedDocumentId={selectedDocument?.id || null}
          search={search}
          onSearchChange={setSearch}
          onSelect={handleSelectDocument}
          onDelete={handleDeleteDocument}
          onUploaded={handleUploaded}
          loading={docsLoading}
          error={docsError}
        />
      }
      main={
        <ChatPanel
          selectedDocument={selectedDocument}
          messages={messages}
          loading={chatLoading}
          error={chatError}
          onSend={handleSend}
          onClear={handleClearChat}
        />
      }
    />
  );
}
