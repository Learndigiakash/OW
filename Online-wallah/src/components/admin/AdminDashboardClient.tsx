"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "./AdminHeader";
import {
  FileText,
  Briefcase,
  FileCheck,
  IdCard,
  Key,
  BookOpen,
  GraduationCap,
  Cog,
  Eye,
  Pin,
  Radio,
  Link2,
  PlusCircle,
  ExternalLink,
  Edit,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardClient({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const categories = [
    { key: "latest-jobs", label: "Latest Jobs", icon: Briefcase, color: "from-blue-500 to-indigo-600", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { key: "results", label: "Results", icon: FileCheck, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { key: "admit-card", label: "Admit Card", icon: IdCard, color: "from-amber-500 to-orange-600", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { key: "answer-key", label: "Answer Key", icon: Key, color: "from-purple-500 to-violet-600", bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { key: "syllabus", label: "Syllabus", icon: BookOpen, color: "from-rose-500 to-pink-600", bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    { key: "admission", label: "Admission", icon: GraduationCap, color: "from-cyan-500 to-blue-600", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    { key: "engineering", label: "Engineering", icon: Cog, color: "from-yellow-500 to-amber-600", bg: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  ];

  return (
    <div>
      <AdminHeader
        title={`Welcome back, ${user?.username || "Editor"}`}
        subtitle="Overview of posts, real-time traffic statistics, and portal status"
        onRefresh={fetchStats}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Posts</span>
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? "..." : stats?.totalPosts || 0}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">{stats?.publishedPosts || 0} published</span>
              <span>•</span>
              <span className="text-amber-400">{stats?.draftPosts || 0} drafts</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Views</span>
              <Eye className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? "..." : (stats?.totalViews || 0).toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">Aggregated candidate page reads</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Ticker</span>
              <Radio className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? "..." : stats?.tickerCount || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">Breaking news marquee headlines</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Portal Links</span>
              <Link2 className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? "..." : stats?.linksCount || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">Official portal direct links</p>
          </div>
        </div>

        {/* Quick Action Banner */}
        <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-800/40 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Ready to publish a new Sarkari Exam notification?</span>
              <span className="px-2 py-0.5 text-[10px] bg-blue-500/20 text-blue-300 rounded font-semibold border border-blue-500/30">Quick Post</span>
            </h2>
            <p className="text-xs text-slate-300">
              Generate structured posts with Important Dates, Application Fees, Vacancies, and Direct Links tables.
            </p>
          </div>
          <Link
            href="/wallah-admin/posts/new"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Post</span>
          </Link>
        </div>

        {/* Category Breakdown Grid */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
            Posts by Vertical / Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = stats?.categoryCounts?.[cat.key] || 0;
              return (
                <Link
                  key={cat.key}
                  href={`/wallah-admin/posts?category=${cat.key}`}
                  className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-col items-center text-center transition-all group"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 border ${cat.bg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">
                    {cat.label}
                  </span>
                  <span className="text-lg font-extrabold text-white mt-1">{count}</span>
                  <span className="text-[10px] text-slate-400">active posts</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Posts Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Recently Updated Posts</span>
            </h3>
            <Link
              href="/wallah-admin/posts"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All Posts</span>
              <span>→</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {stats?.recentPosts?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                      No posts created yet. Click "Create New Post" to start.
                    </td>
                  </tr>
                ) : (
                  stats?.recentPosts?.map((post: any) => (
                    <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 max-w-md">
                        <div className="flex items-center gap-2">
                          {post.isPinned && (
                            <span className="p-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30" title="Pinned Post">
                              <Pin className="w-3 h-3" />
                            </span>
                          )}
                          <span className="font-semibold text-white truncate block">
                            {post.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                          {post.category.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            post.status === "published"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">
                        {post.viewsCount || 0}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${post.category}/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                            title="Preview on public site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/wallah-admin/posts/edit/${post.id}`}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                            title="Edit post"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
