import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
	const { register, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			await register({ name, email, password });
			setSuccess("Account created. You can now sign in.");
			setTimeout(() => navigate("/login", { replace: true }), 600);
		} catch (err) {
			setError(err?.response?.data?.detail || "Registration failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
			<div className="mx-auto flex min-h-screen max-w-screen-xl items-center justify-center px-4">
				<div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30">
					<div className="mb-6">
						<div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Create account</div>
						<div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
							Start using DocuMind AI.
						</div>
					</div>

					{error && (
						<div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
							{error}
						</div>
					)}

					{success && (
						<div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
							{success}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
								Name
							</label>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100/10"
								placeholder="Your name"
							/>
						</div>

						<div>
							<label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100/10"
								placeholder="you@example.com"
							/>
						</div>

						<div>
							<label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								minLength={6}
								className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100/10"
								placeholder="At least 6 characters"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
						>
							{loading ? "Creating…" : "Create account"}
						</button>
					</form>

					<div className="mt-5 text-center text-sm text-zinc-600 dark:text-zinc-300">
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
						>
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
