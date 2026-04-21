import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login({ email, password });
			const dest = location.state?.from?.pathname || "/";
			navigate(dest, { replace: true });
		} catch (err) {
			setError(err?.response?.data?.detail || "Login failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
			<div className="mx-auto flex min-h-screen max-w-screen-xl items-center justify-center px-4">
				<div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/30">
					<div className="mb-6">
						<div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Welcome back</div>
						<div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
							Sign in to your DocuMind AI dashboard.
						</div>
					</div>

					{error && (
						<div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
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
								className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100/10"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
						>
							{loading ? "Signing in…" : "Sign in"}
						</button>
					</form>

					<div className="mt-5 text-center text-sm text-zinc-600 dark:text-zinc-300">
						New here?{" "}
						<Link
							to="/register"
							className="font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
						>
							Create an account
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}