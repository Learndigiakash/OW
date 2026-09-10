import { Metadata } from "next";
import ContactFormClient from "@/components/public/ContactFormClient";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Editorial Helpdesk | OnlineWallah.com",
  description: "Contact the OnlineWallah editorial team for recruitment feedback, error reports, updates, or general inquiries.",
};

export default function ContactPage() {
  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8 space-y-6">
      <div className="bg-[#0A2A66] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-2">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>Candidate Helpdesk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Get in Touch with OnlineWallah
        </h1>
        <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
          Have a question regarding an exam date or want to report an information update? Our editorial team is here to help.
        </p>
      </div>

      <ContactFormClient />
    </main>
  );
}
