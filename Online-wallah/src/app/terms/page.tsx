import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | OnlineWallah.com",
  description: "Terms of service and usage conditions for OnlineWallah.com.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Terms and Conditions of Use
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last Updated: January 2026
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using OnlineWallah.com, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Informational Purpose Only
          </h2>
          <p>
            All content on OnlineWallah is provided exclusively for general information and public awareness. We make no representations or warranties of any kind regarding completeness, accuracy, or reliability.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. External Links
          </h2>
          <p>
            OnlineWallah contains links to third-party government websites and portals. We do not control or endorse the content or policies of these external websites.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Prohibited Uses
          </h2>
          <p>
            Users agree not to scrape, reverse-engineer, or use automated scripts to disrupt or overload our servers.
          </p>
        </section>
      </div>
    </main>
  );
}
