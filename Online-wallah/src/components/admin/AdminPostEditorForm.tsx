"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  IndianRupee,
  Users,
  Link2,
  ListOrdered,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Pin,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface PostEditorProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function AdminPostEditorForm({ initialData, isEditMode = false }: PostEditorProps) {
  const router = useRouter();

  // Basic Post Details
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugCustomized, setIsSlugCustomized] = useState(Boolean(initialData?.slug));
  const [category, setCategory] = useState(initialData?.category || "latest-jobs");
  const [subcategory, setSubcategory] = useState(initialData?.subcategory || "UPSC");
  const [year, setYear] = useState(initialData?.year || 2026);
  const [organization, setOrganization] = useState(initialData?.organization || "");
  const [totalVacancies, setTotalVacancies] = useState(initialData?.totalVacancies || "");
  const [qualificationSummary, setQualificationSummary] = useState(initialData?.qualificationSummary || "");
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc || "");
  const [status, setStatus] = useState(initialData?.status || "published");
  const [isPinned, setIsPinned] = useState(Boolean(initialData?.isPinned));
  const [isNew, setIsNew] = useState(initialData?.isNew !== undefined ? initialData.isNew : true);
  const [isUpdated, setIsUpdated] = useState(Boolean(initialData?.isUpdated));
  const [feePaymentMode, setFeePaymentMode] = useState(
    initialData?.feePaymentMode || "Pay through Net Banking, Debit Card, Credit Card, BHIM UPI or Offline E-Challan."
  );

  // Age Limit object
  const [ageLimit, setAgeLimit] = useState({
    minAge: initialData?.ageLimit?.minAge || "18 Years",
    maxAge: initialData?.ageLimit?.maxAge || "30 Years",
    asOnDate: initialData?.ageLimit?.asOnDate || "01/08/2026",
    extraNotes: initialData?.ageLimit?.extraNotes || "Age relaxation applicable as per official recruitment rules.",
  });

  // Dynamic Repeatable Tables
  const [importantDates, setImportantDates] = useState<Array<{ label: string; value: string; isHighlight?: boolean }>>(
    initialData?.importantDates?.length > 0
      ? initialData.importantDates
      : [
          { label: "Application Begin", value: "Available Now", isHighlight: false },
          { label: "Last Date for Apply Online", value: "30 Days from Notification", isHighlight: true },
          { label: "Exam Date", value: "To be notified soon", isHighlight: true },
          { label: "Admit Card Available", value: "Before Exam", isHighlight: false },
        ]
  );

  const [applicationFee, setApplicationFee] = useState<Array<{ category: string; fee: string; notes?: string }>>(
    initialData?.applicationFee?.length > 0
      ? initialData.applicationFee
      : [
          { category: "General / OBC / EWS", fee: "₹ 100/-" },
          { category: "SC / ST / PH", fee: "₹ 0/- (Nil)" },
          { category: "All Category Female", fee: "₹ 0/- (Exempted)" },
        ]
  );

  const [vacancyDetails, setVacancyDetails] = useState<Array<{ postName: string; totalPosts: string; eligibility: string; ageLimit?: string }>>(
    initialData?.vacancyDetails?.length > 0
      ? initialData.vacancyDetails
      : [
          {
            postName: "Recruitment Post / Officer",
            totalPosts: "100 Posts",
            eligibility: "Bachelor Degree in Any Stream from Recognized University in India.",
            ageLimit: "18-30 Years",
          },
        ]
  );

  const [importantLinks, setImportantLinks] = useState<Array<{ label: string; url: string; linkType?: string; isHighlighted?: boolean }>>(
    initialData?.importantLinks?.length > 0
      ? initialData.importantLinks
      : [
          { label: "Apply Online (Registration / Login)", url: "https://", linkType: "apply", isHighlighted: true },
          { label: "Download Official Notification PDF", url: "https://", linkType: "notification" },
          { label: "Official Portal Website", url: "https://", linkType: "official_website" },
        ]
  );

  const [howToApply, setHowToApply] = useState<string[]>(
    initialData?.howToApply?.length > 0
      ? initialData.howToApply
      : [
          "Visit the official recruitment portal and complete candidate registration.",
          "Fill all required academic, personal and contact details with correct documents.",
          "Upload recent passport size photograph and signature as per prescribed size.",
          "Pay the requisite application fee using online payment gateway.",
          "Take a printout of the final submitted application form for future reference.",
        ]
  );

  const [selectionProcess, setSelectionProcess] = useState<string[]>(
    initialData?.selectionProcess?.length > 0
      ? initialData.selectionProcess
      : ["Stage 1: Written Examination (CBT)", "Stage 2: Skill Test / Interview (If applicable)", "Stage 3: Document Verification & Medical Examination"]
  );

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");

  // Form State
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Auto-generate slug from title
  useEffect(() => {
    if (!isSlugCustomized && title) {
      const generated = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .substring(0, 100);
      setSlug(generated);
    }
  }, [title, isSlugCustomized]);

  // Sync meta description default
  useEffect(() => {
    if (!metaTitle && title) setMetaTitle(title.substring(0, 60));
    if (!metaDescription && shortDesc) setMetaDescription(shortDesc.substring(0, 160));
  }, [title, shortDesc]);

  // --- Handlers for Important Dates ---
  const addDateRow = () => {
    setImportantDates([...importantDates, { label: "", value: "", isHighlight: false }]);
  };
  const updateDateRow = (index: number, field: string, val: any) => {
    const updated = [...importantDates];
    (updated[index] as any)[field] = val;
    setImportantDates(updated);
  };
  const removeDateRow = (index: number) => {
    setImportantDates(importantDates.filter((_, i) => i !== index));
  };

  // --- Handlers for Application Fee ---
  const addFeeRow = () => {
    setApplicationFee([...applicationFee, { category: "", fee: "" }]);
  };
  const updateFeeRow = (index: number, field: string, val: any) => {
    const updated = [...applicationFee];
    (updated[index] as any)[field] = val;
    setApplicationFee(updated);
  };
  const removeFeeRow = (index: number) => {
    setApplicationFee(applicationFee.filter((_, i) => i !== index));
  };

  // --- Handlers for Vacancies ---
  const addVacancyRow = () => {
    setVacancyDetails([...vacancyDetails, { postName: "", totalPosts: "", eligibility: "", ageLimit: "" }]);
  };
  const updateVacancyRow = (index: number, field: string, val: any) => {
    const updated = [...vacancyDetails];
    (updated[index] as any)[field] = val;
    setVacancyDetails(updated);
  };
  const removeVacancyRow = (index: number) => {
    setVacancyDetails(vacancyDetails.filter((_, i) => i !== index));
  };

  // --- Handlers for Links ---
  const addLinkRow = () => {
    setImportantLinks([...importantLinks, { label: "", url: "https://", linkType: "apply" }]);
  };
  const updateLinkRow = (index: number, field: string, val: any) => {
    const updated = [...importantLinks];
    (updated[index] as any)[field] = val;
    setImportantLinks(updated);
  };
  const removeLinkRow = (index: number) => {
    setImportantLinks(importantLinks.filter((_, i) => i !== index));
  };

  // --- Handlers for How To Apply ---
  const addStep = () => setHowToApply([...howToApply, ""]);
  const updateStep = (index: number, val: string) => {
    const updated = [...howToApply];
    updated[index] = val;
    setHowToApply(updated);
  };
  const removeStep = (index: number) => setHowToApply(howToApply.filter((_, i) => i !== index));

  // --- Handlers for Selection Process ---
  const addProcessStep = () => setSelectionProcess([...selectionProcess, ""]);
  const updateProcessStep = (index: number, val: string) => {
    const updated = [...selectionProcess];
    updated[index] = val;
    setSelectionProcess(updated);
  };
  const removeProcessStep = (index: number) => setSelectionProcess(selectionProcess.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        subcategory,
        year: parseInt(year as any) || 2026,
        organization: organization.trim(),
        totalVacancies: totalVacancies.trim(),
        qualificationSummary: qualificationSummary.trim(),
        shortDesc: shortDesc.trim() || title.trim(),
        status,
        isPinned,
        isNew,
        isUpdated,
        importantDates: importantDates.filter((d) => d.label && d.value),
        applicationFee: applicationFee.filter((f) => f.category && f.fee),
        feePaymentMode,
        ageLimit,
        vacancyDetails: vacancyDetails.filter((v) => v.postName),
        importantLinks: importantLinks.filter((l) => l.label && l.url),
        howToApply: howToApply.filter((s) => s.trim()),
        selectionProcess: selectionProcess.filter((s) => s.trim()),
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim() || shortDesc.trim(),
      };

      const url = isEditMode ? `/api/posts/${initialData.id}` : "/api/posts";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save post");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/wallah-admin/posts");
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/wallah-admin/posts"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isEditMode ? "Edit Post Details" : "Create New Job / Exam Post"}
            </h1>
            <p className="text-xs text-slate-400">
              Fill in key dates, application fee structure, vacancies, and direct links
            </p>
          </div>
        </div>

        {/* Edit / Preview Tabs */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === "edit" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Form Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === "preview" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Live Post Preview
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || success}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : isEditMode ? "Save Changes" : "Publish Post"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Post saved successfully! Redirecting to post manager...</span>
        </div>
      )}

      {activeTab === "preview" ? (
        /* LIVE PREVIEW SIMULATOR */
        <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-300 space-y-6">
          <div className="border-b pb-4">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
              {category.toUpperCase()} • YEAR {year} • {subcategory}
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{title || "Post Title Preview"}</h1>
            <p className="text-xs text-slate-600 mt-1">{shortDesc || "Short summary description..."}</p>
          </div>

          {/* Quick Dates & Fee 2-Col Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4">
              <h2 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>⭐ Important Dates</span>
              </h2>
              <ul className="text-xs space-y-1.5">
                {importantDates.map((d, i) => (
                  <li key={i} className="flex justify-between border-b border-blue-100 pb-1">
                    <span className="font-semibold text-slate-700">{d.label}:</span>
                    <span className={d.isHighlight ? "font-bold text-rose-600" : "text-slate-800"}>{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4">
              <h2 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>📋 Application Fee</span>
              </h2>
              <ul className="text-xs space-y-1.5">
                {applicationFee.map((f, i) => (
                  <li key={i} className="flex justify-between border-b border-emerald-100 pb-1">
                    <span className="font-semibold text-slate-700">{f.category}:</span>
                    <span className="font-bold text-emerald-700">{f.fee}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-slate-500 mt-2"><strong>Mode:</strong> {feePaymentMode}</p>
            </div>
          </div>

          {/* Vacancy Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800">
              📌 Vacancy Details & Educational Eligibility
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b">
                <tr>
                  <th className="p-2.5">Post Name</th>
                  <th className="p-2.5">Total Posts</th>
                  <th className="p-2.5">Eligibility Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vacancyDetails.map((v, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-bold text-slate-800">{v.postName}</td>
                    <td className="p-2.5 text-blue-700 font-semibold">{v.totalPosts}</td>
                    <td className="p-2.5 text-slate-700">{v.eligibility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Important Links */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-4 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-200">
              📎 Important Official Direct Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {importantLinks.map((l, i) => (
                <a
                  key={i}
                  href={l.url}
                  target="_blank"
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold flex items-center justify-between transition-colors"
                >
                  <span>{l.label}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* EDIT FORM */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Core Post Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-800">
              1. Core Post Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Post Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPSC Civil Services IAS / IFS Recruitment 2026 Online Form"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Vertical <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="latest-jobs">Latest Jobs</option>
                  <option value="results">Results</option>
                  <option value="admit-card">Admit Card</option>
                  <option value="answer-key">Answer Key</option>
                  <option value="syllabus">Syllabus</option>
                  <option value="admission">Admission</option>
                  <option value="engineering">Engineering</option>
                </select>
              </div>

              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  SEO Friendly URL Slug <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setIsSlugCustomized(true);
                      setSlug(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-blue-400 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Path: <code className="text-slate-400">/{category}/{slug || "slug-preview"}</code>
                </p>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subcategory / Department
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="UPSC">UPSC</option>
                  <option value="SSC">SSC</option>
                  <option value="Railway">Railway (RRB)</option>
                  <option value="Banking">Banking (IBPS/SBI)</option>
                  <option value="Police">Police</option>
                  <option value="Defense">Defense (NDA/CDS)</option>
                  <option value="Teaching">Teaching (CTET/TET)</option>
                  <option value="State PSC">State PSC</option>
                  <option value="NTA">NTA (NEET/JEE/CUET)</option>
                  <option value="Engineering">Engineering / PSU</option>
                  <option value="General">General / Other</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recruiting Organization / Board
                </label>
                <input
                  type="text"
                  placeholder="e.g. Union Public Service Commission (UPSC)"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Vacancies
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1,105 Posts"
                  value={totalVacancies}
                  onChange={(e) => setTotalVacancies(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Qualification Snippet
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bachelor Degree in Any Stream"
                  value={qualificationSummary}
                  onChange={(e) => setQualificationSummary(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-12">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Short Description (Used for SERP snippet & post card summary — max 160 chars)
                </label>
                <textarea
                  rows={2}
                  maxLength={250}
                  placeholder="Brief summary of the recruitment or exam notification..."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">{shortDesc.length}/250 characters</span>
              </div>
            </div>

            {/* Badges & Flags Row */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700 focus:ring-blue-500"
                />
                <span className="font-semibold text-amber-300 flex items-center gap-1">
                  <Pin className="w-3.5 h-3.5" /> Pin Post to Top
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-slate-950 border-slate-700 focus:ring-emerald-500"
                />
                <span className="font-semibold text-emerald-400">Mark with [NEW] Badge</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUpdated}
                  onChange={(e) => setIsUpdated(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-600 bg-slate-950 border-slate-700 focus:ring-orange-500"
                />
                <span className="font-semibold text-orange-400">Mark with [UPDATED] Badge</span>
              </label>

              <div className="flex items-center gap-2 ml-auto">
                <span className="font-semibold text-slate-400">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Important Dates & Application Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dates Builder */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>2. Important Dates</span>
                </h3>
                <button
                  type="button"
                  onClick={addDateRow}
                  className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Date
                </button>
              </div>

              <div className="space-y-2">
                {importantDates.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      placeholder="e.g. Application Begin"
                      value={item.label}
                      onChange={(e) => updateDateRow(index, "label", e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 14/02/2026"
                      value={item.value}
                      onChange={(e) => updateDateRow(index, "value", e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                    />
                    <label className="flex items-center gap-1 text-[10px] text-amber-400 cursor-pointer" title="Highlight in red/bold">
                      <input
                        type="checkbox"
                        checked={Boolean(item.isHighlight)}
                        onChange={(e) => updateDateRow(index, "isHighlight", e.target.checked)}
                        className="rounded text-amber-500 bg-slate-900 border-slate-700"
                      />
                      <span>HL</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeDateRow(index)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Fee Builder */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4" />
                  <span>3. Application Fee</span>
                </h3>
                <button
                  type="button"
                  onClick={addFeeRow}
                  className="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Fee Row
                </button>
              </div>

              <div className="space-y-2">
                {applicationFee.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      placeholder="e.g. General / OBC / EWS"
                      value={item.category}
                      onChange={(e) => updateFeeRow(index, "category", e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g. ₹ 100/-"
                      value={item.fee}
                      onChange={(e) => updateFeeRow(index, "fee", e.target.value)}
                      className="w-28 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-semibold text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeeRow(index)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Payment Mode Note
                </label>
                <input
                  type="text"
                  value={feePaymentMode}
                  onChange={(e) => setFeePaymentMode(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Age Limit & Relaxations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-800">
              4. Age Limit & Relaxations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Minimum Age</label>
                <input
                  type="text"
                  placeholder="e.g. 18 Years"
                  value={ageLimit.minAge}
                  onChange={(e) => setAgeLimit({ ...ageLimit, minAge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Maximum Age</label>
                <input
                  type="text"
                  placeholder="e.g. 32 Years"
                  value={ageLimit.maxAge}
                  onChange={(e) => setAgeLimit({ ...ageLimit, maxAge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Age Calculated As On</label>
                <input
                  type="text"
                  placeholder="e.g. 01/08/2026"
                  value={ageLimit.asOnDate}
                  onChange={(e) => setAgeLimit({ ...ageLimit, asOnDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Age Relaxation Rules Note</label>
                <input
                  type="text"
                  placeholder="e.g. Age Relaxation Extra as per UPSC Civil Services Examination Rules 2026."
                  value={ageLimit.extraNotes}
                  onChange={(e) => setAgeLimit({ ...ageLimit, extraNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Vacancy & Eligibility Table Builder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>5. Vacancy & Eligibility Details Table</span>
              </h3>
              <button
                type="button"
                onClick={addVacancyRow}
                className="px-2.5 py-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Vacancy Post
              </button>
            </div>

            <div className="space-y-3">
              {vacancyDetails.map((v, index) => (
                <div key={index} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Post Name (e.g. Indian Administrative Service IAS)"
                      value={v.postName}
                      onChange={(e) => updateVacancyRow(index, "postName", e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Total (e.g. 955 Posts)"
                      value={v.totalPosts}
                      onChange={(e) => updateVacancyRow(index, "totalPosts", e.target.value)}
                      className="w-32 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-blue-400 font-bold text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Age (e.g. 21-32 Yrs)"
                      value={v.ageLimit || ""}
                      onChange={(e) => updateVacancyRow(index, "ageLimit", e.target.value)}
                      className="w-28 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeVacancyRow(index)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Educational Qualification & Eligibility criteria (e.g. Bachelor Degree in Any Stream from recognized university)"
                      value={v.eligibility}
                      onChange={(e) => updateVacancyRow(index, "eligibility", e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Important Links Builder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-4 h-4" />
                <span>6. Important Links (Direct Apply / Download Buttons)</span>
              </h3>
              <button
                type="button"
                onClick={addLinkRow}
                className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Direct Link
              </button>
            </div>

            <div className="space-y-2">
              {importantLinks.map((l, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    placeholder="Link Label (e.g. Apply Online / Download Notification)"
                    value={l.label}
                    onChange={(e) => updateLinkRow(index, "label", e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-medium text-xs focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={l.url}
                    onChange={(e) => updateLinkRow(index, "url", e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-blue-400 font-mono text-xs focus:outline-none"
                  />
                  <select
                    value={l.linkType || "apply"}
                    onChange={(e) => updateLinkRow(index, "linkType", e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs focus:outline-none"
                  >
                    <option value="apply">Apply Online</option>
                    <option value="notification">Notification PDF</option>
                    <option value="result">Check Result</option>
                    <option value="admit_card">Admit Card</option>
                    <option value="answer_key">Answer Key</option>
                    <option value="syllabus">Syllabus PDF</option>
                    <option value="official_website">Official Website</option>
                    <option value="other">Other Link</option>
                  </select>
                  <label className="flex items-center gap-1 text-[10px] text-emerald-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(l.isHighlighted)}
                      onChange={(e) => updateLinkRow(index, "isHighlighted", e.target.checked)}
                      className="rounded text-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <span>Highlight</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeLinkRow(index)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: How to Apply & Selection Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-blue-400" />
                  <span>7. How to Apply Steps</span>
                </h3>
                <button
                  type="button"
                  onClick={addStep}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg"
                >
                  + Add Step
                </button>
              </div>

              <div className="space-y-2">
                {howToApply.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateStep(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>8. Selection Process Stages</span>
                </h3>
                <button
                  type="button"
                  onClick={addProcessStep}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg"
                >
                  + Add Stage
                </button>
              </div>

              <div className="space-y-2">
                {selectionProcess.map((stage, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={stage}
                      onChange={(e) => updateProcessStep(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeProcessStep(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 7: SEO Meta & Google SERP Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider pb-2 border-b border-slate-800">
              9. SEO Meta Tags & Google SERP Snippet Preview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Meta Title (Max 60 characters)
                  </label>
                  <input
                    type="text"
                    maxLength={70}
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="e.g. UPSC IAS Recruitment 2026 Notification Out - 1105 Posts"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">{metaTitle.length}/60 chars</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Meta Description (Max 160 characters)
                  </label>
                  <textarea
                    rows={2}
                    maxLength={170}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="e.g. Check UPSC Civil Services 2026 exam date, online form, eligibility and direct PDF download link."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">{metaDescription.length}/160 chars</span>
                </div>
              </div>

              {/* Live Google Search Card Simulation */}
              <div className="bg-white text-slate-900 p-4 rounded-xl border border-slate-300 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Google Search SERP Preview
                </span>
                <div className="text-[11px] text-[#202124] truncate flex items-center gap-1 font-sans">
                  <span>https://onlinewallah.com › {category} › {slug || "post-url"}</span>
                </div>
                <h4 className="text-base text-[#1a0dab] font-medium hover:underline line-clamp-1 mt-0.5 font-sans">
                  {metaTitle || title || "Post Title Goes Here | OnlineWallah"}
                </h4>
                <p className="text-xs text-[#4d5156] line-clamp-2 mt-1 font-sans leading-relaxed">
                  {metaDescription || shortDesc || "Post meta description snippet will appear here on search engines..."}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Submit Button */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              href="/wallah-admin/posts"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || success}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Post..." : isEditMode ? "Save Changes" : "Publish Post"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
