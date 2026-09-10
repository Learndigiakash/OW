"use client";

import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { Plus, Radio, Trash2, Edit2, CheckCircle2, AlertCircle, Save, ExternalLink } from "lucide-react";

export default function AdminTickerManagerClient({ user }: { user: any }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [badgeText, setBadgeText] = useState("NEW");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ticker?all=true");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      if (editingId) {
        const res = await fetch(`/api/ticker/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, linkUrl, badgeText, displayOrder }),
        });
        if (res.ok) {
          setStatusMsg("Ticker item updated");
          setEditingId(null);
        }
      } else {
        const res = await fetch("/api/ticker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, linkUrl, badgeText, displayOrder, isActive: true }),
        });
        if (res.ok) {
          setStatusMsg("Ticker item added");
        }
      }

      setMessage("");
      setLinkUrl("");
      setBadgeText("NEW");
      setDisplayOrder(0);
      fetchItems();
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      const res = await fetch(`/api/ticker/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isActive: !item.isActive } : i))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this ticker item?")) return;
    try {
      const res = await fetch(`/api/ticker/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setMessage(item.message);
    setLinkUrl(item.linkUrl || "");
    setBadgeText(item.badgeText || "NEW");
    setDisplayOrder(item.displayOrder || 0);
  };

  return (
    <div>
      <AdminHeader
        title="Breaking News Ticker"
        subtitle="Manage the marquee headlines that auto-scroll across the top of every page"
        onRefresh={fetchItems}
      />

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {statusMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Form to Add / Edit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>{editingId ? "Edit Ticker Headline" : "Add New Ticker Headline"}</span>
          </h2>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Headline Text *</label>
              <input
                type="text"
                required
                placeholder="e.g. UPSC CSE 2026 Notification Out - Apply Online for 1,105 Posts"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Link (Optional)</label>
              <input
                type="text"
                placeholder="e.g. /latest-jobs/upsc-ias-2026"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Badge</label>
              <select
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
              >
                <option value="NEW">NEW (Green)</option>
                <option value="OUT">OUT (Blue)</option>
                <option value="ALERT">ALERT (Red)</option>
                <option value="UPDATED">UPDATED (Orange)</option>
              </select>
            </div>

            <div className="md:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>

        {/* Ticker Items List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-800 text-xs font-bold text-slate-300">
            Active & Archived Marquee Messages ({items.length})
          </div>

          <div className="divide-y divide-slate-800">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500">Loading ticker headlines...</div>
            ) : items.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No ticker messages created yet.</div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider ${
                        item.badgeText === "OUT"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : item.badgeText === "ALERT"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : item.badgeText === "UPDATED"
                          ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {item.badgeText || "NEW"}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white">{item.message}</p>
                      {item.linkUrl && (
                        <p className="text-[11px] text-blue-400 font-mono mt-0.5">{item.linkUrl}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        item.isActive
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.isActive ? "Active" : "Paused"}
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
