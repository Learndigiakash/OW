"use client";

import { useState } from "react";
import {
  Share2,
  Copy,
  Printer,
  Check,
  Send,
  MessageCircle,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface ToolsProps {
  title: string;
  url: string;
  category: string;
  minAge?: string;
  maxAge?: string;
  qualificationSummary?: string;
}

export default function PostDetailClientTools({
  title,
  url,
  category,
  minAge,
  maxAge,
  qualificationSummary,
}: ToolsProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Quick Eligibility Checker state
  const [userAge, setUserAge] = useState<number | "">("");
  const [userQual, setUserQual] = useState("Graduate");
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  const fullUrl = typeof window !== "undefined" ? window.location.href : `https://onlinewallah.com${url}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareText = encodeURIComponent(`${title} — Check details, dates & apply online: ${fullUrl}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`;

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAge) return;

    const min = parseInt(minAge || "18") || 18;
    const max = parseInt(maxAge || "32") || 32;

    if (userAge >= min && userAge <= max) {
      setEligibilityResult(`✅ You meet the primary Age Limit (${min} - ${max} Years) & Qualification (${qualificationSummary || userQual})!`);
    } else if (userAge < min) {
      setEligibilityResult(`❌ Below minimum required age of ${min} Years.`);
    } else {
      setEligibilityResult(`⚠️ Age (${userAge} Yrs) exceeds General limit (${max} Yrs). Reserved categories may still qualify with relaxation!`);
    }
  };

  return (
    <div className="space-y-4 no-print select-none">
      {/* Action Toolbar */}
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Share Post:</span>
          </span>

          {/* WhatsApp Deeplink */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Share to WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Telegram Share */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Share on Telegram"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </a>

          {/* Twitter/X */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Share on X"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Link Button */}
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "Copy Link"}</span>
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Print-friendly view"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Interactive Quick Eligibility Checker */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-200 dark:border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Quick Eligibility Self-Checker
          </h4>
        </div>

        <form onSubmit={checkEligibility} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-4">
            <input
              type="number"
              min={15}
              max={65}
              placeholder="Your Age (e.g. 23)"
              value={userAge}
              onChange={(e) => setUserAge(e.target.value ? parseInt(e.target.value) : "")}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-5">
            <select
              value={userQual}
              onChange={(e) => setUserQual(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="10th Pass">10th Matriculation</option>
              <option value="12th Pass">10+2 Intermediate</option>
              <option value="ITI / Diploma">ITI / Polytechnic Diploma</option>
              <option value="Graduate">Graduate Degree (BA/B.Sc/B.Com/B.Tech)</option>
              <option value="Post Graduate">Post Graduate / Master Degree</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Test Eligibility
            </button>
          </div>
        </form>

        {eligibilityResult && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
            {eligibilityResult}
          </div>
        )}
      </div>
    </div>
  );
}
