import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and, ne, desc, sql } from "drizzle-orm";
import PostDetailClientTools from "@/components/public/PostDetailClientTools";
import {
  Calendar,
  IndianRupee,
  Users,
  Link2,
  ListOrdered,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Clock,
  Eye,
  Building,
  GraduationCap,
  Download,
  AlertCircle,
  FileCheck,
} from "lucide-react";

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.category, category), eq(posts.slug, slug)))
    .limit(1);

  if (rows.length === 0) {
    return { title: "Post Not Found" };
  }

  const post = rows[0];
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.shortDesc;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://onlinewallah.com/${category}/${slug}`,
      publishedTime: post.publishDate.toISOString(),
      modifiedTime: post.lastModified.toISOString(),
      siteName: "OnlineWallah.com",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/${category}/${slug}`,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function IndividualPostPage({ params }: PostPageProps) {
  const { category, slug } = await params;

  // Query post by category & slug
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.category, category), eq(posts.slug, slug)))
    .limit(1);

  if (rows.length === 0) {
    notFound();
  }

  const post = rows[0];

  // Increment views count asynchronously
  await db
    .update(posts)
    .set({ viewsCount: sql`${posts.viewsCount} + 1` })
    .where(eq(posts.id, post.id));

  // Query related posts in the same category
  const relatedPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      category: posts.category,
      subcategory: posts.subcategory,
      isNew: posts.isNew,
      publishDate: posts.publishDate,
    })
    .from(posts)
    .where(and(eq(posts.category, category), ne(posts.id, post.id)))
    .orderBy(desc(posts.publishDate))
    .limit(5);

  const importantDates = post.importantDates || [];
  const applicationFee = post.applicationFee || [];
  const vacancyDetails = post.vacancyDetails || [];
  const importantLinks = post.importantLinks || [];
  const howToApply = post.howToApply || [];
  const selectionProcess = post.selectionProcess || [];
  const ageLimit = post.ageLimit || {};

  // Generate JSON-LD Structured Data Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: post.title,
    description: post.shortDesc,
    datePosted: post.publishDate.toISOString(),
    validThrough: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: post.organization || "Government of India / State Authority",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
    },
    qualifications: post.qualificationSummary || "As per official notification",
    educationRequirements: post.qualificationSummary || "Graduate / 10th / 12th",
  };

  return (
    <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 space-y-6">
      {/* JSON-LD for Search Engine Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href={`/${category}`}
          className="hover:text-blue-600 dark:hover:text-blue-400 font-medium capitalize"
        >
          {category.replace("-", " ")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs sm:max-w-md">
          {post.title}
        </span>
      </nav>

      {/* Main Post Container (Print Friendly Area) */}
      <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6 print-area">
        {/* Printable Header (Visible only when printing) */}
        <div className="hidden print-header">
          <h2 className="text-xl font-bold">ONLINE WALLAH (onlinewallah.com)</h2>
          <p className="text-xs">India's Trusted Job & Exam Information Portal</p>
        </div>

        {/* Post Heading Block */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {post.category.replace("-", " ")}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {post.subcategory}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Year {post.year}
            </span>
            {post.isNew && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded">
                NEW
              </span>
            )}
            {post.isUpdated && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500 text-slate-950 rounded">
                UPDATED
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {post.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
            {post.organization && (
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>{post.organization}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Published: {new Date(post.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.viewsCount.toLocaleString()} Views</span>
            </span>
          </div>
        </div>

        {/* Short Summary Description */}
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-slate-950/70 border border-blue-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          {post.shortDesc}
        </div>

        {/* Interactive Social & Utility Share Toolbar */}
        <PostDetailClientTools
          title={post.title}
          url={`/${post.category}/${post.slug}`}
          category={post.category}
          minAge={ageLimit?.minAge}
          maxAge={ageLimit?.maxAge}
          qualificationSummary={post.qualificationSummary || undefined}
        />

        {/* 2-Column Responsive Structured Cards: Important Dates + Application Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* TABLE 1: IMPORTANT DATES */}
          <div className="border border-blue-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-[#0A2A66] text-white px-4 py-2.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                ⭐ Important Dates
              </h2>
            </div>
            <div className="p-4">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {importantDates.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-2 pr-2 font-semibold text-slate-700 dark:text-slate-300">
                        {item.label}:
                      </td>
                      <td className={`py-2 text-right font-bold ${item.isHighlight ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE 2: APPLICATION FEE */}
          <div className="border border-emerald-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-[#0A2A66] text-white px-4 py-2.5 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider">
                📋 Application Fee
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applicationFee.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-2 pr-2 font-semibold text-slate-700 dark:text-slate-300">
                        {item.category}:
                      </td>
                      <td className="py-2 text-right font-black text-emerald-600 dark:text-emerald-400">
                        {item.fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                <strong className="text-slate-800 dark:text-slate-200">Payment Modes:</strong> {post.feePaymentMode}
              </div>
            </div>
          </div>
        </div>

        {/* TABLE 3: AGE LIMIT & ELIGIBILITY CRITERIA */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-[#0A2A66] text-white px-4 py-2.5 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              📌 Age Limit & Relaxations (As on {ageLimit?.asOnDate || "Notification Date"})
            </h2>
          </div>
          <div className="p-4 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Minimum Age</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{ageLimit?.minAge || "18 Years"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Maximum Age</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{ageLimit?.maxAge || "32 Years"}</span>
              </div>
            </div>
            {ageLimit?.extraNotes && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300 italic pt-1">
                ℹ️ {ageLimit.extraNotes}
              </p>
            )}
          </div>
        </div>

        {/* TABLE 4: VACANCY & EDUCATIONAL ELIGIBILITY DETAILS */}
        {vacancyDetails.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-[#0A2A66] text-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider">
                  🏢 Vacancy & Educational Eligibility Details ({post.totalVacancies || "Multiple Posts"})
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Post Name</th>
                    <th className="p-3">Total Posts</th>
                    <th className="p-3">Age Limit</th>
                    <th className="p-3">Eligibility Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {vacancyDetails.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{v.postName}</td>
                      <td className="p-3 font-black text-blue-700 dark:text-blue-400 whitespace-nowrap">{v.totalPosts}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{v.ageLimit || "18-32 Yrs"}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">{v.eligibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABLE 5: IMPORTANT OFFICIAL DIRECT LINKS (High-CTR Colored Buttons) */}
        <div className="border-2 border-blue-600 dark:border-blue-500 bg-gradient-to-br from-blue-900 via-[#0A2A66] to-indigo-950 text-white rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-blue-400/30">
            <Link2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-300">
              📎 Important Official Direct Links
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {importantLinks.map((link, idx) => {
              const isApply = link.linkType === "apply" || link.isHighlighted;
              return (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3.5 rounded-xl font-bold text-xs flex items-center justify-between transition-all shadow-md group ${
                    isApply
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black scale-[1.01]"
                      : "bg-white/15 hover:bg-white/25 text-white border border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isApply ? <Sparkles className="w-4 h-4 text-slate-950" /> : <ExternalLink className="w-4 h-4 text-blue-200" />}
                    <span className="line-clamp-1">{link.label}</span>
                  </div>
                  <span className="text-[11px] font-black underline group-hover:translate-x-1 transition-transform shrink-0 ml-2">
                    Click Here ↗
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* SECTION 6: HOW TO APPLY STEPS */}
        {howToApply.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <ListOrdered className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                How to Fill Online Application Form
              </h2>
            </div>
            <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {howToApply.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-blue-200 dark:border-blue-800">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* SECTION 7: SELECTION PROCESS & EXAM SCHEME */}
        {selectionProcess.length > 0 && (
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Selection Process & Examination Scheme
              </h2>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {selectionProcess.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SECTION 8: MANDATORY DISCLAIMER BOX ON EVERY POST PAGE */}
        <div className="bg-amber-50 dark:bg-slate-950 border border-amber-300 dark:border-amber-500/40 rounded-2xl p-4 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <p className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5 uppercase text-[11px]">
            <ShieldAlert className="w-4 h-4" />
            <span>Important Aggregator Advisory Notice</span>
          </p>
          <p className="text-[11px] leading-relaxed">
            OnlineWallah is an independent information aggregator and is not affiliated with, endorsed by, or associated with any government authority, exam board, or public institution. All information is sourced from official government websites for public awareness. For official and verified information, always refer to the respective official website before submitting any payment or registration.
          </p>
        </div>
      </article>

      {/* SECTION 9: RELATED POSTS IN SAME VERTICAL */}
      {relatedPosts.length > 0 && (
        <section aria-label="Related Posts" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 no-print">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>More Recent {category.replace("-", " ")} Updates</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                href={`/${rel.category}/${rel.slug}`}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-all flex flex-col justify-between group"
              >
                <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                  {rel.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                  <span>{rel.subcategory}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">View →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
