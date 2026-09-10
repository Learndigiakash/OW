"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("onlinewallah_cookie_consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("onlinewallah_cookie_consent", "accepted");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md text-xs space-y-3 select-none no-print">
      <div className="flex items-start gap-2.5">
        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-bold text-white">We Value Candidate Privacy</p>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            OnlineWallah uses cookies and analytics to ensure you receive real-time job notifications and an optimized browsing experience. Read our{" "}
            <Link href="/privacy-policy" className="text-blue-400 underline hover:text-blue-300">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <button
          onClick={() => setShowConsent(false)}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={acceptCookies}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Accept & Continue</span>
        </button>
      </div>
    </div>
  );
}
