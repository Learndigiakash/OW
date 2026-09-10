"use client";

import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { Link2, Plus, Trash2, Edit2, ExternalLink, Save, CheckCircle2 } from "lucide-react";

export default function AdminPortalsManagerClient({ user }: { user: any }) {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("https://");
  const [category, setCategory] = useState("UPSC");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/important-links?all=true");
      const data = await res.json();
      setLinks(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;

    try {
      if (editingId) {
        const res = await fetch(`/api/important-links/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, url, category, description }),
        });
        if (res.ok) {
          setStatusMsg("Link updated successfully");
          setEditingId(null);
        }
      } else {
        const res = await fetch("/api/important-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, url, category, description }),
        });
        if (res.ok) {
          setStatusMsg("Portal link added");
        }
      }

      setLabel("");
      setUrl("https://");
      setDescription("");
      fetchLinks();
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this portal directory entry?")) return;
    try {
      const res = await fetch(`/api/important-links/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setLabel(item.label);
    setUrl(item.url);
    setCategory(item.category);
    setDescription(item.description || "");
  };

  return (
    <div>
      <AdminHeader
        title="Official Portals & Important Links"
        subtitle="Manage verified official links to UPSC, SSC, RRB, NTA, IBPS, and State PSC portals"
        onRefresh={fetchLinks}
      />

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {statusMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-purple-400" />
            <span>{editingId ? "Edit Portal Link" : "Add New Official Portal"}</span>
          </h2>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Portal Label *</label>
              <input
                type="text"
                required
                placeholder="e.g. UPSC Official Portal"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Official URL *</label>
              <input
                type="url"
                required
                placeholder="https://upsc.gov.in"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-blue-400 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
              >
                <option value="UPSC">UPSC</option>
                <option value="SSC">SSC</option>
                <option value="Railway">Railway</option>
                <option value="NTA">NTA</option>
                <option value="Banking">Banking</option>
                <option value="State PSC">State PSC</option>
                <option value="Defense">Defense</option>
                <option value="Teaching">Teaching</option>
                <option value="Engineering">Engineering</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>

        {/* Portals Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-800 text-xs font-bold text-slate-300">
            Registered Government Portals ({links.length})
          </div>

          <div className="divide-y divide-slate-800">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500">Loading portal links...</div>
            ) : links.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No portal links added yet.</div>
            ) : (
              links.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.category}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-400 hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
                      >
                        <span>{item.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
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
