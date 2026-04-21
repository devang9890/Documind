import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

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
      setSuccess("Account created successfully. Navigating to sign in...");
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#09090b] selection:bg-zinc-800">
      <div className="flex w-full flex-col lg:flex-row-reverse">
        {/* Right Form Section */}
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
              <h2 className="text-3xl font-medium tracking-tight text-zinc-100 mb-2">Create an account</h2>
              <p className="text-zinc-500">Join thousands of students studying smarter.</p>
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

            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 text-sm text-emerald-400 shadow-sm"
              >
                {success}
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
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-700 focus:bg-zinc-900 hover:border-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-800/30 transition-all duration-200"
                  placeholder="Alex Doe"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  University Email
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
                  Create Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-700 focus:bg-zinc-900 hover:border-zinc-700 focus:outline-none focus:ring-4 focus:ring-zinc-800/30 transition-all duration-200"
                  placeholder="At least 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-zinc-100 px-4 py-3.5 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? "Creating account..." : "Start Learning"}
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
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-zinc-300 hover:text-white transition-colors duration-200">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Left Graphic Section */}
        <div className="relative hidden w-0 flex-1 lg:flex lg:flex-col lg:justify-center lg:items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/30 via-zinc-950 to-zinc-950 border-r border-zinc-900/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 max-w-lg px-12"
          >
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl backdrop-blur-md">
              <GraduationCap className="h-8 w-8 text-zinc-300" />
            </div>
            <h3 className="mb-6 text-4xl font-semibold tracking-tight text-zinc-100">
              Study 10x faster.
            </h3>
            <div className="space-y-6 text-lg text-zinc-500">
              <p>
                <span className="text-zinc-300 font-medium">1.</span> Upload your densest lecture notes or textbooks.
              </p>
              <p>
                <span className="text-zinc-300 font-medium">2.</span> Instantly get summaries, conceptual explanations, and answers exactly where you are confused.
              </p>
              <p>
                <span className="text-zinc-300 font-medium">3.</span> Say goodbye to mindless scrolling through pages.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
