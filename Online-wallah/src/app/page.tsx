import Link from "next/link";
import { db } from "@/db";
import { posts, newsTicker, importantLinks } from "@/db/schema";
import { runSeed } from "@/db/seed";
import { desc, eq, and } from "drizzle-orm";
import NewsTicker from "@/components/public/NewsTicker";
import AgeCalculator from "@/components/public/AgeCalculator";
import JobAlertsBox from "@/components/public/JobAlertsBox";
import {
  Briefcase,
  FileCheck,
  IdCard,
  Key,
  BookOpen,
  GraduationCap,
  Cog,
  ChevronRight,
  ExternalLink,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Building2,
  Shield,
  Layers,
} from "lucide-react";

// Server function to format relative date
function formatRelativeTime(date: Date): string {
  const diffInSeconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Ensure database has seed data if empty
  let allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.isPinned), desc(posts.publishDate));

  if (allPosts.length === 0) {
    try {
      await runSeed();
      allPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.status, "published"))
        .orderBy(desc(posts.isPinned), desc(posts.publishDate));
    } catch (err) {
      console.error("Auto-seed error:", err);
    }
  }

  // Fetch news ticker
  const tickerItems = await db
    .select()
    .from(newsTicker)
    .where(eq(newsTicker.isActive, true))
    .orderBy(desc(newsTicker.createdAt));

  // Fetch portals
  const portals = await db
    .select()
    .from(importantLinks)
    .where(eq(importantLinks.isActive, true))
    .orderBy(importantLinks.displayOrder);

  // Group posts by category
  const latestJobs = allPosts.filter((p) => p.category === "latest-jobs").slice(0, 15);
  const results = allPosts.filter((p) => p.category === "results").slice(0, 10);
  const admitCards = allPosts.filter((p) => p.category === "admit-card").slice(0, 10);
  const answerKeys = allPosts.filter((p) => p.category === "answer-key").slice(0, 8);
  const syllabus = allPosts.filter((p) => p.category === "syllabus").slice(0, 6);
  const admissions = allPosts.filter((p) => p.category === "admission").slice(0, 8);
  const engineering = allPosts.filter((p) => p.category === "engineering").slice(0, 6);

  // Spotlight trending posts (first 4 pinned or new)
  const spotlightPosts = allPosts.filter((p) => p.isPinned || p.isNew).slice(0, 4);

  const quickActionButtons = [
    { label: "Latest Jobs", icon: "💼", href: "/latest-jobs", count: latestJobs.length, bg: "from-blue-600 to-indigo-700" },
    { label: "Results", icon: "📋", href: "/results", count: results.length, bg: "from-emerald-600 to-teal-700" },
    { label: "Admit Card", icon: "🪪", href: "/admit-card", count: admitCards.length, bg: "from-amber-600 to-orange-700" },
    { label: "Answer Key", icon: "🗝️", href: "/answer-key", count: answerKeys.length, bg: "from-purple-600 to-violet-700" },
    { label: "Syllabus", icon: "📚", href: "/syllabus", count: syllabus.length, bg: "from-rose-600 to-pink-700" },
    { label: "Admission", icon: "🎓", href: "/admission", count: admissions.length, bg: "from-cyan-600 to-blue-700" },
    { label: "Engineering", icon: "⚙️", href: "/engineering", count: engineering.length, bg: "from-amber-500 to-amber-700" },
  ];

  return (
    <main className="space-y-6 pb-12">
      {/* 1. Breaking News Marquee */}
      <NewsTicker initialItems={tickerItems} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-6">
        {/* 2. SECTION 1: Quick Action Grid (7 buttons: 2x3 mobile, 3x2 tablet, 7x1 desktop) */}
        <section aria-label="Quick Action Categories">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {quickActionButtons.map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className={`bg-gradient-to-r ${btn.bg} text-white p-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center text-center group`}
              >
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{btn.icon}</span>
                <span className="text-xs font-bold tracking-tight line-clamp-1">{btn.label}</span>
                <span className="text-[10px] text-white/80 font-medium mt-0.5">
                  {btn.count}+ Active
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. TRENDING SPOTLIGHT FLASH CARDS */}
        {spotlightPosts.length > 0 && (
          <section aria-label="Trending Notifications">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {spotlightPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.category}/${post.slug}`}
                  className="bg-white dark:bg-slate-900 border-2 border-blue-600/30 dark:border-blue-500/30 hover:border-blue-600 dark:hover:border-blue-400 rounded-xl p-3.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {post.subcategory || post.category}
                      </span>
                      {post.isNew && (
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-500 text-white rounded">
                          NEW
                        </span>
                      )}
                      {post.isUpdated && (
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-500 text-slate-950 rounded">
                          UPDATED
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{post.totalVacancies || "Online Form"}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 4. SECTION 2: HIGH DENSITY 3-COLUMN LAYOUT (The SarkariResult-style optimized for rapid scanning) */}
        <section aria-label="Main Recruitment Feeds" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* COLUMN 1: LATEST JOBS (15 items) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            {/* Box Header */}
            <div className="bg-[#0A2A66] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-extrabold tracking-wide uppercase">
                  Latest Jobs
                </h2>
              </div>
              <Link
                href="/latest-jobs"
                className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1"
              >
                <span>View All ({latestJobs.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Post List */}
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
              {latestJobs.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/${post.category}/${post.slug}`}
                    className="p-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 block transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 line-clamp-2 leading-relaxed">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0 mt-0.5">
                        {post.isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded">
                            NEW
                          </span>
                        )}
                        {post.isUpdated && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-500 text-slate-950 rounded">
                            UPD
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {post.organization || post.subcategory}
                      </span>
                      <span>{formatRelativeTime(post.publishDate)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link
                href="/latest-jobs"
                className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Explore All Government Job Notifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* COLUMN 2: RESULTS (10) + ADMIT CARDS (10) */}
          <div className="space-y-5 flex flex-col">
            {/* 2A. Results Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#0A2A66] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-extrabold tracking-wide uppercase">
                    Results
                  </h2>
                </div>
                <Link
                  href="/results"
                  className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/${post.category}/${post.slug}`}
                      className="p-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 block transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 line-clamp-2">
                          {post.title}
                        </h3>
                        {post.isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {post.subcategory}
                        </span>
                        <span>{formatRelativeTime(post.publishDate)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2B. Admit Card Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex-1">
              <div className="bg-[#0A2A66] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-extrabold tracking-wide uppercase">
                    Admit Card
                  </h2>
                </div>
                <Link
                  href="/admit-card"
                  className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {admitCards.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/${post.category}/${post.slug}`}
                      className="p-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 block transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 line-clamp-2">
                          {post.title}
                        </h3>
                        {post.isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          {post.subcategory}
                        </span>
                        <span>{formatRelativeTime(post.publishDate)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 3: ADMISSIONS (8) + ANSWER KEYS (8) + SYLLABUS (6) */}
          <div className="space-y-5 flex flex-col">
            {/* 3A. Admissions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#0A2A66] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-extrabold tracking-wide uppercase">
                    Admission Forms
                  </h2>
                </div>
                <Link
                  href="/admission"
                  className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {admissions.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/${post.category}/${post.slug}`}
                      className="p-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 block transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 line-clamp-2">
                          {post.title}
                        </h3>
                        {post.isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                          {post.organization || post.subcategory}
                        </span>
                        <span>{formatRelativeTime(post.publishDate)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3B. Answer Keys */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#0A2A66] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  <h2 className="text-sm font-extrabold tracking-wide uppercase">
                    Answer Key
                  </h2>
                </div>
                <Link
                  href="/answer-key"
                  className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {answerKeys.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/${post.category}/${post.slug}`}
                      className="p-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 block transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 line-clamp-2">
                          {post.title}
                        </h3>
                        {post.isNew && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-600 text-white rounded shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="text-purple-600 dark:text-purple-400 font-medium">
                          {post.subcategory}
                        </span>
                        <span>{formatRelativeTime(post.publishDate)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3C. Syllabus */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#0A2A66] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-rose-400" />
                  <h2 className="text-sm font-extrabold tracking-wide uppercase">
                    Syllabus
                  </h2>
                </div>
                <Link
                  href="/syllabus"
                  className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {syllabus.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/${post.category}/${post.slug}`}
                      className="p-3 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 block transition-colors group"
                    >
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="text-rose-600 dark:text-rose-400 font-medium">
                          {post.subcategory}
                        </span>
                        <span>PDF Available</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. SECTION 3: IMPORTANT OFFICIAL GOVERNMENT PORTALS DIRECTORY (3-Column Grid) */}
        <section aria-label="Official Government Portals Directory" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Important Official Government Portals Directory
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Direct official links to Central & State examination authorities
                </p>
              </div>
            </div>
            <Link
              href="/important-links"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>All 60+ Portals</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
            {portals.slice(0, 15).map((portal) => (
              <a
                key={portal.id}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-between group"
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {portal.label}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize truncate">
                    {portal.category}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 ml-1.5" />
              </a>
            ))}
          </div>
        </section>

        {/* 6. SECTION 4: INTERACTIVE CANDIDATE UTILITY TOOLS */}
        <section aria-label="Candidate Utility Tools" className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AgeCalculator />
          <JobAlertsBox />
        </section>

        {/* 7. SECTION 5: POPULAR STATE & DEPARTMENT QUICK TAGS */}
        <section aria-label="Department Categories" className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider text-[11px]">
            ⚡ Fast Filter by State / Sector:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "UPSC Civil Services", href: "/latest-jobs?subcategory=UPSC" },
              { label: "SSC (CGL/CHSL/GD/JE)", href: "/latest-jobs?subcategory=SSC" },
              { label: "Railway (RRB ALP/NTPC)", href: "/latest-jobs?subcategory=Railway" },
              { label: "Banking (SBI/IBPS)", href: "/latest-jobs?subcategory=Banking" },
              { label: "Defense (NDA/CDS/Navy)", href: "/latest-jobs?subcategory=Defense" },
              { label: "Police Recruitment", href: "/latest-jobs?subcategory=Police" },
              { label: "Teaching (CTET/STET)", href: "/latest-jobs?subcategory=Teaching" },
              { label: "Engineering & PSUs", href: "/engineering" },
              { label: "NTA Medical & Engineering", href: "/admission" },
              { label: "Year 2026 Jobs", href: "/latest-jobs?year=2026" },
            ].map((tag, idx) => (
              <Link
                key={idx}
                href={tag.href}
                className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-full text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
