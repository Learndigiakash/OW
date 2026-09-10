"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import AdminHeader from "./AdminHeader";
import {
  Search,
  PlusCircle,
  Pin,
  Sparkles,
  RefreshCw,
  Trash2,
  Edit,
  ExternalLink,
  Filter,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
} from "lucide-react";

export default function AdminPostsManagerClient({ user }: { user: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedYear !== "all") params.append("year", selectedYear);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
      params.append("page", page.toString());
      params.append("limit", "15");
      params.append("includeDrafts", "true");

      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(data.items || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, selectedYear, selectedStatus, debouncedSearch, page]);

  const handleToggleBadge = async (post: any, field: "isPinned" | "isNew" | "isUpdated" | "status") => {
    try {
      let updatePayload: any = {};
      if (field === "status") {
        updatePayload.status = post.status === "published" ? "draft" : "published";
      } else {
        updatePayload[field] = !post[field];
      }

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, ...updatePayload } : p))
        );
        setActionMessage(`Updated ${post.title.substring(0, 30)}...`);
        setTimeout(() => setActionMessage(""), 2500);
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleDelete = async (postId: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setTotal((prev) => Math.max(0, prev - 1));
        setActionMessage("Post deleted successfully");
        setTimeout(() => setActionMessage(""), 2500);
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "latest-jobs", label: "Latest Jobs" },
    { value: "results", label: "Results" },
    { value: "admit-card", label: "Admit Card" },
    { value: "answer-key", label: "Answer Key" },
    { value: "syllabus", label: "Syllabus" },
    { value: "admission", label: "Admission" },
    { value: "engineering", label: "Engineering" },
  ];

  return (
    <div>
      <AdminHeader
        title="Post Manager"
        subtitle="Create, edit, pin, mark NEW/UPDATED, and manage all portal postings"
        onRefresh={fetchPosts}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search posts by title, org, qualifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {actionMessage && (
              <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30">
                {actionMessage}
              </span>
            )}
            <Link
              href="/wallah-admin/posts/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Post</span>
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-medium"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="all">All Years</option>
            <option value="2026">Year 2026</option>
            <option value="2025">Year 2025</option>
            <option value="2024">Year 2024</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="all">All Status</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          <span className="ml-auto text-slate-400 font-medium">
            Showing <strong className="text-white">{posts.length}</strong> of{" "}
            <strong className="text-white">{total}</strong> posts
          </span>
        </div>

        {/* Posts Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Post Title / Organization</th>
                  <th className="px-4 py-3">Category / Year</th>
                  <th className="px-4 py-3 text-center">Badges & Flags</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      Loading posts...
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      No posts found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 max-w-md">
                        <div className="flex flex-col">
                          <span className="font-bold text-white line-clamp-1">
                            {post.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            {post.organization && <span>{post.organization}</span>}
                            {post.totalVacancies && (
                              <span className="text-blue-400 font-semibold">
                                • {post.totalVacancies}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200 border border-slate-700 capitalize w-fit">
                            {post.category.replace("-", " ")}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Year {post.year}
                          </span>
                        </div>
                      </td>

                      {/* Interactive Toggle Badges */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleToggleBadge(post, "isPinned")}
                            title={post.isPinned ? "Unpin post" : "Pin post to top"}
                            className={`p-1.5 rounded text-[10px] font-bold transition-all ${
                              post.isPinned
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-slate-800 text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleBadge(post, "isNew")}
                            title={post.isNew ? "Remove NEW badge" : "Mark as NEW"}
                            className={`px-1.5 py-1 rounded text-[10px] font-extrabold tracking-wider transition-all ${
                              post.isNew
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-slate-800 text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            NEW
                          </button>

                          <button
                            onClick={() => handleToggleBadge(post, "isUpdated")}
                            title={post.isUpdated ? "Remove UPDATED badge" : "Mark as UPDATED"}
                            className={`px-1.5 py-1 rounded text-[10px] font-extrabold tracking-wider transition-all ${
                              post.isUpdated
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                                : "bg-slate-800 text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            UPD
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleBadge(post, "status")}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                            post.status === "published"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                              : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
                          }`}
                        >
                          {post.status}
                        </button>
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-400">
                        {post.viewsCount || 0}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/${post.category}/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                            title="View post on public site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/wallah-admin/posts/edit/${post.id}`}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                            title="Edit full post content & tables"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                            title="Delete post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
