import { Metadata } from "next";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer Notice & Legal Terms | OnlineWallah.com",
  description: "Non-government affiliation disclaimer and informational aggregator disclosure for OnlineWallah.com.",
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase text-xs tracking-wider">
            <ShieldAlert className="w-5 h-5" />
            <span>Official Legal Notice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Disclaimer & Aggregator Disclosure
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last modified: 1st January 2026
          </p>
        </div>

        {/* Highlight Quote Box */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-slate-950 border-2 border-amber-400/60 text-slate-900 dark:text-slate-200 space-y-2">
          <p className="font-bold text-amber-900 dark:text-amber-400">
            Primary Non-Affiliation Statement:
          </p>
          <p className="text-xs sm:text-sm font-medium leading-relaxed italic">
            &quot;OnlineWallah (onlinewallah.com) is an independent informational aggregator and is NOT affiliated with, endorsed by, or associated with any government authority, exam board, Union/State Public Service Commission, or public institution. All information is sourced from official government websites for public awareness. For official and verified information, always refer to the respective official website.&quot;
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Nature of the Portal
          </h2>
          <p>
            OnlineWallah is purely an educational aggregator intended to assist students, job seekers, and candidates across India in finding relevant notifications for competitive examinations, Sarkari jobs, entrance examinations, results, answer keys, and syllabus.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Source of Information & Verification
          </h2>
          <p>
            Information displayed on OnlineWallah is compiled by our editorial team from public advertisements, official employment gazettes, press releases, and official authority websites (e.g., upsc.gov.in, ssc.gov.in, indianrailways.gov.in, nta.ac.in). While we strive to ensure 100% accuracy, inadvertent typographical errors or omissions may occasionally occur.
          </p>
          <p>
            Candidates are strongly advised to check and verify original PDF notifications before submitting examination fees or personal credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. No Financial Transactions or Fee Collections
          </h2>
          <p>
            OnlineWallah does NOT charge candidates any fee for accessing notifications, links, syllabus, or result PDFs. We do NOT collect application fees or manage registrations. All application forms and fee payments must be processed directly on the verified official portal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Limitation of Liability
          </h2>
          <p>
            Under no circumstances shall OnlineWallah or its contributors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or reliance upon information presented on this site.
          </p>
        </section>
      </div>
    </main>
  );
}
