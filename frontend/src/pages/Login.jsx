import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="flex min-h-screen w-full bg-[#09090b] selection:bg-zinc-800">
      <div className="flex w-full flex-col lg:flex-row">
        {/* Left Form Section */}
        <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 xl:px-12 z-10">
          <div className="mx-auto w-full max-w-sm lg:max-w-md">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold tracking-wide text-zinc-100">DocuMind AI</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-2">Welcome back</h2>
              <p className="text-zinc-500">Sign in to your AI study assistant.</p>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400 shadow-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-700 focus:bg-zinc-900 hover:border-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-800/30 transition-all duration-200"
                  placeholder="student@university.edu"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-700 focus:bg-zinc-900 hover:border-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-800/30 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-zinc-100 px-4 py-3.5 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? "Signing in..." : "Continue"}
                {!loading && <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />}
              </button>
            </motion.form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-zinc-500">
                New to DocuMind?{" "}
                <Link to="/register" className="font-medium text-zinc-300 hover:text-white transition-colors duration-200">
                  Create an account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Graphic Section */}
        <div className="relative hidden w-0 flex-1 lg:flex lg:flex-col lg:justify-center lg:items-center bg-zinc-950 px-12 border-l border-zinc-900/50">
          {/* Subtle background glow effect using a radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 max-w-lg text-center"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-zinc-400" />
              <span>Next generation study tool</span>
            </div>
            <h3 className="mb-6 text-4xl font-semibold tracking-tight text-zinc-100">
              Your notes, decoded.
            </h3>
            <p className="text-lg leading-relaxed text-zinc-500">
              Upload your lecture slides, class notes, or textbooks, and Instantly chat with them, generate quizzes, and prepare for finals effortlessly.
            </p>
          </motion.div>
          
          {/* Decorative graphic elements */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative z-10 mt-16 w-full max-w-sm rounded-2xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/80 to-zinc-900/20 p-6 shadow-2xl backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-3/4 rounded-md bg-zinc-800/80"></div>
              <div className="h-4 w-full rounded-md bg-zinc-800/50"></div>
              <div className="h-4 w-5/6 rounded-md bg-zinc-800/50"></div>
            </div>
            <div className="mt-6 flex justify-end">
              <div className="inline-flex items-center rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-900">
                AI Explaining...
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}