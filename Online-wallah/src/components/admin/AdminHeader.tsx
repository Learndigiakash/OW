"use client";

import { Bell, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function AdminHeader({ title, subtitle, onRefresh }: { title: string; subtitle?: string; onRefresh?: () => void }) {
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const handleSeed = async () => {
    if (!confirm("This will verify categories and seed/update default realistic jobs if needed. Proceed?")) return;
    setSeeding(true);
    setSeedMsg("Seeding database...");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedMsg("Database seeded successfully!");
        if (onRefresh) onRefresh();
        setTimeout(() => setSeedMsg(""), 3000);
      } else {
        setSeedMsg("Seeding failed: " + data.error);
      }
    } catch (err: any) {
      setSeedMsg("Error seeding");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {seedMsg && (
          <span className="text-xs font-medium px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
            {seedMsg}
          </span>
        )}

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/40 transition-colors disabled:opacity-50"
          title="Seed realistic posts & default links"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{seeding ? "Seeding..." : "Quick Re-Seed Data"}</span>
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
