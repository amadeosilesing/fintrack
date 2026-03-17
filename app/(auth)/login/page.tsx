"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      login(data.token, data.user);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-700 flex items-center justify-center relative overflow-hidden">

      {/* Blob shapes */}
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] bg-white/[0.07] rounded-[60%_40%_70%_30%/50%_60%_40%_50%]" />
      <div className="absolute -top-28 -right-20 w-96 h-96 bg-white/[0.07] rounded-[40%_60%_30%_70%/60%_40%_60%_40%]" />
      <div className="absolute top-[40%] right-[8%] w-48 h-48 bg-white/[0.05] rounded-[50%_50%_40%_60%/60%_40%_60%_40%]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg mx-6 px-8 py-16 bg-white/[0.08] backdrop-blur-sm rounded-3xl border border-white/15 shadow-2xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-white/15 border border-white/30 rounded-3xl flex items-center justify-center text-4xl mb-5 shadow-lg">
            💰
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">FinTrack</h1>
          <p className="text-white/60 text-sm mt-1.5 font-light">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-base">👤</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="EMAIL"
              required
              className="w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-white/40 placeholder:text-xs placeholder:tracking-widest focus:outline-none focus:bg-white/15 focus:border-white/50 transition"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-base">🔒</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="PASSWORD"
              required
              className="w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-white/40 placeholder:text-xs placeholder:tracking-widest focus:outline-none focus:bg-white/15 focus:border-white/50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-white text-green-700 rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-90 hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <a href="#" className="block text-center mt-5 text-sm text-white/45 hover:text-white/75 transition">
          Forgot password?
        </a>

        <p className="text-center text-sm text-white/50 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-white font-semibold underline underline-offset-2 hover:text-white/80 transition">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}