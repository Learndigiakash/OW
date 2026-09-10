"use client";

import Link from "next/link";
import {
  ShieldAlert,
  Send,
  MessageCircle,
  Share2,
  Globe,
  ArrowUp,
  Heart,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#071D49] text-blue-100 border-t border-blue-900 pt-10 pb-6 text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* MANDATORY AGGREGATOR LEGAL DISCLAIMER BOX */}
        <div className="bg-blue-950/80 border border-amber-400/40 rounded-2xl p-4 md:p-5 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 mt-0.5 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Mandatory Legal Disclaimer & Information Aggregator Notice
              </h4>
              <p className="text-[11px] md:text-xs text-blue-200 leading-relaxed">
                <strong>OnlineWallah (onlinewallah.com)</strong> is an independent educational and recruitment information aggregator portal. We are <strong>not affiliated with, endorsed by, or associated with</strong> any Government authority, Union/State Public Service Commission, Examination Board, or Public Institution. All information, notifications, dates, syllabus, and results published here are sourced exclusively from official public government portals and gazettes for student awareness. For verified information, candidates must cross-check with the respective official website.
              </p>
            </div>
          </div>
        </div>

        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Column 1: Brand & Social */}
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                OW
              </div>
              <span className="font-extrabold text-sm text-white uppercase tracking-wide">
                Online Wallah
              </span>
            </div>
            <p className="text-[11px] text-blue-300 leading-relaxed">
              India's trusted aggregator for Sarkari Job recruitment, results, admit cards, exam answer keys, syllabus, and university admissions.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://t.me/onlinewallah"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors"
                title="Join Telegram Channel"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com/channel/onlinewallah"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                title="Follow WhatsApp Channel"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors"
                title="Follow on Twitter/X"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"
                title="YouTube Exam Updates"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
              Top Categories
            </h5>
            <ul className="space-y-1.5 text-[11px] text-blue-200">
              <li>
                <Link href="/latest-jobs" className="hover:text-white hover:underline">
                  Latest Sarkari Jobs
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-white hover:underline">
                  Sarkari Exam Results
                </Link>
              </li>
              <li>
                <Link href="/admit-card" className="hover:text-white hover:underline">
                  Admit Card & Hall Ticket
                </Link>
              </li>
              <li>
                <Link href="/answer-key" className="hover:text-white hover:underline">
                  Official Answer Keys
                </Link>
              </li>
              <li>
                <Link href="/syllabus" className="hover:text-white hover:underline">
                  Exam Syllabus & Pattern
                </Link>
              </li>
              <li>
                <Link href="/admission" className="hover:text-white hover:underline">
                  Entrance Admissions
                </Link>
              </li>
              <li>
                <Link href="/engineering" className="hover:text-white hover:underline">
                  Engineering & PSU Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Exam Boards Portals */}
          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
              Recruitment Boards
            </h5>
            <ul className="space-y-1.5 text-[11px] text-blue-200">
              <li>
                <a href="https://upsc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>UPSC (Civil Services)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://ssc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>SSC (CGL, CHSL, GD, JE)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://indianrailways.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Railway RRB Recruitment</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://ibps.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>IBPS Banking Exams</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://nta.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>National Testing Agency (NTA)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <Link href="/important-links" className="text-amber-300 font-semibold hover:underline">
                  View All Official Portals →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Year Archive & State Links */}
          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
              Year Archives
            </h5>
            <ul className="space-y-1.5 text-[11px] text-blue-200">
              <li>
                <Link href="/latest-jobs?year=2026" className="hover:text-white hover:underline">
                  Latest Jobs 2026
                </Link>
              </li>
              <li>
                <Link href="/results?year=2026" className="hover:text-white hover:underline">
                  Exam Results 2026
                </Link>
              </li>
              <li>
                <Link href="/latest-jobs?year=2025" className="hover:text-white hover:underline">
                  Jobs Archive 2025
                </Link>
              </li>
              <li>
                <Link href="/results?year=2025" className="hover:text-white hover:underline">
                  Results Archive 2025
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:underline">
                  Candidate Helpdesk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Legal & Policy */}
          <div className="space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
              Legal & Policies
            </h5>
            <ul className="space-y-1.5 text-[11px] text-blue-200">
              <li>
                <Link href="/disclaimer" className="hover:text-white hover:underline">
                  Disclaimer Notice
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:underline">
                  Contact Editorial Team
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Back to Top */}
        <div className="pt-6 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-blue-300">
          <p>© {new Date().getFullYear()} OnlineWallah.com — All rights reserved. Free Educational Job Aggregator.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>SSL Secured & Verified Sources</span>
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 px-3 py-1 bg-blue-900/80 hover:bg-blue-800 text-white rounded-lg transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
