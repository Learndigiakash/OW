"use client";

import { useState } from "react";
import { Bell, Send, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";

export default function JobAlertsBox() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, categoryPreference: category }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-950 text-white rounded-2xl p-5 md:p-6 border border-emerald-500/30 shadow-xl">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-md">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Free Instant Sarkari Job Alerts
          </h3>
          <p className="text-xs text-emerald-200">
            Never miss an application deadline, admit card or result announcement
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Thank you! You are now subscribed to receive instant Sarkari exam alerts.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {errorMsg && (
            <p className="text-[11px] text-rose-300 bg-rose-500/20 p-2 rounded-lg border border-rose-500/30">
              {errorMsg}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-5">
              <input
                type="email"
                required
                placeholder="Enter your Email ID..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="sm:col-span-4">
              <input
                type="tel"
                placeholder="Mobile / WhatsApp (Optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? "Subscribing..." : "Get Free Alerts"}</span>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            🔒 100% Free Service. Zero spam. Unsubscribe anytime.
          </p>
        </form>
      )}
    </div>
  );
}
