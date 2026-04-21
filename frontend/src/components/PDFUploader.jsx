import { useState } from "react";

import API from "../services/api";

export default function PDFUploader({ onUploaded, compact = false }) {
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const uploadPDF = async () => {
		setError("");

		if (!file) {
			setError("Please select a PDF.");
			return;
		}

		try {
			setLoading(true);

			const formData = new FormData();
			formData.append("file", file);

			const res = await API.post("/upload/pdf", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setFile(null);

			if (typeof onUploaded === "function") {
				onUploaded(res.data.document || null);
			}
		} catch (err) {
			setError(err?.response?.data?.detail || "Upload failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={compact ? "" : "p-6"}>
			{!compact && (
				<h1 className="text-2xl mb-4 text-zinc-900 dark:text-zinc-100">Upload PDF</h1>
			)}

			<div className={compact ? "space-y-2" : "flex items-center gap-3"}>
				<input
					type="file"
					accept=".pdf"
					onChange={(e) => setFile(e.target.files?.[0] || null)}
					className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-800 hover:file:bg-zinc-200 dark:text-zinc-200 dark:file:bg-zinc-900 dark:file:text-zinc-100 dark:hover:file:bg-zinc-800"
				/>

				<button
					type="button"
					onClick={uploadPDF}
					disabled={loading}
					className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
				>
					{loading ? "Uploading…" : "Upload"}
				</button>
			</div>

			{error && (
				<div className="mt-2 text-xs text-red-700 dark:text-red-300">{error}</div>
			)}
		</div>
	);
}