"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Calendar,
  Building,
  GraduationCap,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface CategoryListingProps {
  categorySlug: string;
  categoryTitle: string;
  categoryDescription: string;
}

export default function CategoryListingClient({
  categorySlug,
  categoryTitle,
  categoryDescription,
}: CategoryListingProps) {
  const searchParams = useSearchParams();
  const initialYear = searchParams.get("year") || "all";
  const initialSubcategory = searchParams.get("subcategory") || "all";

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const subcategories = [
    { value: "all", label: "All Departments" },
    { value: "UPSC", label: "UPSC" },
    { value: "SSC", label: "SSC" },
    { value: "Railway", label: "Railway (RRB)" },
    { value: "Banking", label: "Banking (IBPS/SBI)" },
    { value: "Police", label: "Police" },
    { value: "Defense", label: "Defense (NDA/CDS)" },
    { value: "Teaching", label: "Teaching (CTET)" },
    { value: "NTA", label: "NTA (NEET/JEE)" },
    { value: "State PSC", label: "State PSCs" },
    { value: "Engineering", label: "Engineering" },
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("category", categorySlug);
      if (selectedYear !== "all") params.append("year", selectedYear);
      if (selectedSubcategory !== "all") params.append("subcategory", selectedSubcategory);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      params.append("page", page.toString());
      params.append("limit", "20");

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
  }, [categorySlug, selectedYear, selectedSubcategory, searchQuery, page]);

  return (
    <div className="space-y-6">
      {/* Category Hero Banner */}
      <div className="bg-[#0A2A66] text-white rounded-2xl p-6 shadow-md">
        <div className="max-w-3xl space-y-2">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            Category Vertical
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {categoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
            {categoryDescription}
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Department Filter */}
          <select
            value={selectedSubcategory}
            onChange={(e) => {
              setSelectedSubcategory(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            {subcategories.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
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
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Years</option>
            <option value="2026">Year 2026</option>
            <option value="2025">Year 2025</option>
            <option value="2024">Year 2024</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={`Search ${categoryTitle}...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Posts List Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
          Loading {categoryTitle}...
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No posts found matching the selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedYear("all");
              setSelectedSubcategory("all");
              setSearchQuery("");
            }}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${post.category}/${post.slug}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {post.subcategory}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {post.year}
                  </span>
                  {post.isNew && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded">
                      NEW
                    </span>
                  )}
                  {post.isUpdated && (
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-500 text-slate-950 rounded">
                      UPDATED
                    </span>
                  )}
                </div>

                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {post.shortDesc}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  {post.organization && (
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-blue-600" />
                      <span>{post.organization}</span>
                    </span>
                  )}
                  {post.totalVacancies && (
                    <span className="font-semibold text-blue-700 dark:text-blue-400">
                      • {post.totalVacancies}
                    </span>
                  )}
                  <span>
                    • Published: {new Date(post.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end sm:justify-center">
                <span className="px-4 py-2 bg-blue-50 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <span>
            Showing page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
