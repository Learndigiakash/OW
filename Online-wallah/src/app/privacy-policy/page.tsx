import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | OnlineWallah.com",
  description: "Privacy Policy and data protection standards for OnlineWallah.com.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Effective Date: January 1, 2026
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Information We Collect
          </h2>
          <p>
            At OnlineWallah.com, we respect your personal privacy. We collect minimal information necessary to deliver our services:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Subscription Details:</strong> When you subscribe for free email or WhatsApp job alerts, we store your email or contact preference securely.</li>
            <li><strong>Contact Inquiries:</strong> If you use our contact form, we collect your name, email, and query to provide a response.</li>
            <li><strong>Log Files & Analytics:</strong> Standard server logs include IP addresses, browser type, referring pages, and timestamp to analyze traffic and prevent DDoS attacks.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Cookies and Web Beacons
          </h2>
          <p>
            OnlineWallah uses cookies to remember user preferences (such as Dark Mode settings) and analyze traffic patterns. Third-party partners, including Google AdSense, may use cookies to serve ads based on prior visits to this or other websites.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Data Protection & No Selling of Data
          </h2>
          <p>
            We do NOT sell, rent, or trade your personal information to third parties or marketing brokers. You can unsubscribe from job alert emails at any time with 1 click.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Contact Our Privacy Officer
          </h2>
          <p>
            If you have questions about this privacy policy, you may contact us at <code className="text-blue-600 dark:text-blue-400 font-mono">privacy@onlinewallah.com</code>.
          </p>
        </section>
      </div>
    </main>
  );
}
