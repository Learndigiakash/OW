"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";

export interface TickerItem {
  id: number;
  message: string;
  linkUrl?: string | null;
  badgeText?: string | null;
  isActive: boolean;
}

export default function NewsTicker({ initialItems = [] }: { initialItems?: TickerItem[] }) {
  const [items, setItems] = useState<TickerItem[]>(initialItems);

  useEffect(() => {
    if (initialItems.length === 0) {
      fetch("/api/ticker")
        .then((res) => res.json())
        .then((data) => {
          if (data.items) setItems(data.items);
        })
        .catch((err) => console.error("Ticker fetch error:", err));
    }
  }, [initialItems]);

  if (items.length === 0) return null;

  // Duplicate items array to make marquee seamless infinite loop
  const displayItems = [...items, ...items, ...items];

  return (
    <div className="bg-[#FFF4E5] dark:bg-slate-900 border-y border-[#FFE0B2] dark:border-slate-800 py-1.5 px-3 flex items-center shadow-xs overflow-hidden news-ticker-container select-none">
      {/* Ticker Label Badge */}
      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[11px] rounded-md shadow-xs mr-3 z-10 tracking-wide uppercase">
        <Megaphone className="w-3.5 h-3.5" />
        <span>Latest Updates:</span>
      </div>

      {/* Auto-scrolling continuous Marquee */}
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-marquee flex items-center gap-6 py-0.5 text-xs text-slate-800 dark:text-slate-200">
          {displayItems.map((item, index) => {
            const isClickable = Boolean(item.linkUrl);

            return (
              <span key={`${item.id}-${index}`} className="inline-flex items-center gap-2 shrink-0">
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded ${
                    item.badgeText === "OUT"
                      ? "bg-blue-600 text-white"
                      : item.badgeText === "ALERT"
                      ? "bg-rose-600 text-white"
                      : item.badgeText === "UPDATED"
                      ? "bg-amber-600 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {item.badgeText || "NEW"}
                </span>

                {isClickable ? (
                  <Link
                    href={item.linkUrl!}
                    className="hover:text-blue-700 dark:hover:text-amber-400 font-semibold hover:underline transition-colors"
                  >
                    {item.message}
                  </Link>
                ) : (
                  <span className="font-semibold">{item.message}</span>
                )}

                <span className="text-amber-400 font-bold ml-2">★</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
