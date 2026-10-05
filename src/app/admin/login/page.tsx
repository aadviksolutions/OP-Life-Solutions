"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("admin");
  const [password, setPassword] = useState("AdminPassword@123");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError("Please fill in both username/email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#041627] relative px-4 sm:px-6 lg:px-8 py-12">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0B314D]/60 via-[#06223B]/80 to-[#041627] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-block p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl mb-4">
            <img
              src="/images/ops-logo.jpg"
              alt="Om Prakash Sahu Insurance"
              className="w-16 h-16 object-cover rounded-xl"
            />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Agency Management Portal
          </h2>
          <p className="text-xs text-[#D9A441] font-semibold tracking-wider uppercase mt-1">
            OM PRAKASH SAHU INSURANCE SERVICES
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#06223B]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-6 pb-3 border-b border-white/10">
            <Lock className="w-4 h-4 text-[#D9A441]" />
            <span>Restricted Staff Access</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="admin or admin@opsinsurance.in"
                  className="w-full pl-10 pr-4 py-3 bg-[#0B314D]/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("For security, password reset requests are handled by the system administrator. Please contact Om Prakash Sahu at +91 98261 45892.")}
                  className="text-xs text-[#D9A441] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#0B314D]/80 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A441] focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B666B] bg-slate-800 border-slate-700 focus:ring-0"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D9A441] to-[#F2C96B] hover:from-[#c28f30] hover:to-[#deb353] text-[#06223B] font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all duration-200 text-sm group disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#06223B]" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#06223B] group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-slate-400">
            <span className="block font-semibold text-slate-300 mb-1">Pre-filled Demo Admin Credentials:</span>
            <div className="inline-block bg-[#041627]/60 border border-white/10 px-3 py-1.5 rounded-lg font-mono text-[11px] text-[#F2C96B]">
              admin / AdminPassword@123
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-white transition inline-flex items-center gap-1"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
