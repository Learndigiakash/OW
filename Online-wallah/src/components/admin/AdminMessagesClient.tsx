"use client";

import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import { Mail, User, Clock, CheckCircle } from "lucide-react";

export default function AdminMessagesClient({ user }: { user: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <AdminHeader
        title="Candidate Inquiries & Contact Messages"
        subtitle="Review feedback, corrections, and inquiries sent by visitors"
        onRefresh={fetchMessages}
      />

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3.5 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Inquiries Received ({messages.length})</span>
          </div>

          <div className="divide-y divide-slate-800">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No inquiries received yet. Inquiries submitted via /contact will appear here.
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="p-5 hover:bg-slate-800/40 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{msg.name}</span>
                      <span className="text-[11px] text-blue-400 font-mono">({msg.email})</span>
                      {msg.phone && (
                        <span className="text-[10px] text-slate-400">📞 {msg.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-200">Subject: {msg.subject}</p>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
