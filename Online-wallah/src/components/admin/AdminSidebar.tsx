"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Radio,
  Link2,
  Mail,
  LogOut,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/wallah-admin/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/wallah-admin", icon: LayoutDashboard, exact: true },
    { label: "All Posts", href: "/wallah-admin/posts", icon: FileText, exact: true },
    { label: "Create Post", href: "/wallah-admin/posts/new", icon: PlusCircle },
    { label: "News Ticker", href: "/wallah-admin/ticker", icon: Radio },
    { label: "Portal Links", href: "/wallah-admin/portals", icon: Link2 },
    { label: "Messages & Alerts", href: "/wallah-admin/messages", icon: Mail },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
            OW
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide text-white uppercase">Online Wallah</h1>
            <p className="text-[10px] text-blue-400 font-medium tracking-wider">CMS CONTROL PANEL</p>
          </div>
        </div>
        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
          v2.0
        </span>
      </div>

      {/* User Info */}
      <div className="px-5 py-3.5 bg-slate-800/50 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
          {user?.username?.[0]?.toUpperCase() || "A"}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-white truncate">{user?.username || "Admin"}</p>
          <p className="text-[11px] text-slate-400 truncate capitalize">{user?.role || "Administrator"}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Public Portal</p>
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4" />
              <span>View Live Website</span>
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">↗</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
