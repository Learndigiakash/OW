import { Metadata } from "next";
import { db } from "@/db";
import { importantLinks } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { Building2, ExternalLink, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Official Government Exam Portals Directory | OnlineWallah.com",
  description: "Verified official directory of UPSC, SSC, RRB Railways, IBPS, NTA, State PSCs, Defense, and Police recruitment websites.",
};

export const dynamic = "force-dynamic";

export default async function ImportantLinksPage() {
  const allLinks = await db
    .select()
    .from(importantLinks)
    .where(eq(importantLinks.isActive, true))
    .orderBy(asc(importantLinks.displayOrder));

  // Group links by category
  const categories = Array.from(new Set(allLinks.map((l) => l.category)));

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8 space-y-8">
      {/* Hero */}
      <div className="bg-[#0A2A66] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-2">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Official Portal Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Verified Indian Government & Institution Portals
        </h1>
        <p className="text-xs sm:text-sm text-blue-200 max-w-3xl leading-relaxed">
          Direct verified links to official examination boards, central ministries, railway recruitment boards, state public service commissions, and national testing agencies.
        </p>
      </div>

      {/* Advisory Banner */}
      <div className="bg-emerald-50 dark:bg-slate-900 border border-emerald-300 dark:border-emerald-500/30 rounded-2xl p-4 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Safe Browsing Notice:</strong> Always verify the domain extension (<code className="bg-emerald-100 dark:bg-emerald-950 px-1 py-0.5 rounded font-mono">.gov.in</code> or <code className="bg-emerald-100 dark:bg-emerald-950 px-1 py-0.5 rounded font-mono">.nic.in</code>) before making any payment or submitting confidential information on external websites.
        </span>
      </div>

      {/* Categorized Directory Grids */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catLinks = allLinks.filter((l) => l.category === cat);
          return (
            <div
              key={cat}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
            >
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>{cat} Portals</span>
                <span className="text-xs font-normal text-slate-400">({catLinks.length} portals)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-all flex items-start justify-between gap-2 group"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 block truncate">
                        {link.label}
                      </span>
                      {link.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {link.description}
                        </p>
                      )}
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 block truncate">
                        {link.url}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
