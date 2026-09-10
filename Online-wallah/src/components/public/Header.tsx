"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Send,
  MessageCircle,
  Briefcase,
  Bell,
  Sparkles,
  ChevronRight,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Today's date string in IST format
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set formatted date
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    };
    setCurrentDate(now.toLocaleDateString("en-IN", options));

    // Check dark mode preference
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDarkMode(true);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Latest Jobs", href: "/latest-jobs" },
    { label: "Results", href: "/results" },
    { label: "Admit Card", href: "/admit-card" },
    { label: "Answer Key", href: "/answer-key" },
    { label: "Syllabus", href: "/syllabus" },
    { label: "Admission", href: "/admission" },
    { label: "Engineering", href: "/engineering" },
    { label: "Important Links", href: "/important-links" },
    { label: "Contact Us", href: "/contact" },
  ];

  const handleSearchResultClick = (category: string, slug: string) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    router.push(`/${category}/${slug}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A2A66] text-white shadow-md select-none">
      {/* Top Utility Bar */}
      <div className="border-b border-blue-900/60 bg-[#071D49] text-[11px] text-blue-200 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{currentDate || "Live Portal Updates"}</span>
            </span>
            <span className="hidden sm:inline text-blue-400">|</span>
            <span className="hidden sm:inline text-amber-300 font-semibold">
              🇮🇳 India's #1 Fast Sarkari Job Alerts
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://t.me/onlinewallah"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sky-300 hover:text-white transition-colors"
            >
              <Send className="w-3 h-3" />
              <span className="font-semibold">Join Telegram</span>
            </a>
            <span className="text-blue-500">|</span>
            <a
              href="https://whatsapp.com/channel/onlinewallah"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-white transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="font-semibold">WhatsApp Alerts</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Mobile menu hamburger button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 -ml-2 text-white hover:bg-blue-800 rounded-lg focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Text-based Logo & Subtitle */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-600 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            OW
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-extrabold tracking-tight text-white uppercase group-hover:text-amber-300 transition-colors">
              Online Wallah
            </span>
            <span className="text-[10px] md:text-[11px] text-blue-200 font-medium tracking-wide">
              India's Trusted Job Portal
            </span>
          </div>
        </Link>

        {/* Debounced Search with Autosuggestion */}
        <div ref={searchRef} className="relative flex-1 max-w-lg hidden sm:block mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search UPSC, SSC, Railway, NEET, Admit Cards, Results..."
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              className="w-full bg-blue-950/80 text-white placeholder:text-blue-300/70 text-xs rounded-full pl-9 pr-8 py-2 border border-blue-400/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-blue-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autosuggestion Dropdown */}
          {isSearchOpen && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-800 dark:text-slate-100 max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Search Suggestions</span>
                {isSearching && <span className="text-blue-500">Searching...</span>}
              </div>

              {searchResults.length === 0 && !isSearching ? (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  No matching jobs, results, or admit cards found for &quot;{searchQuery}&quot;.
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearchResultClick(item.category, item.slug)}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-slate-800/80 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="capitalize font-medium text-blue-700 dark:text-blue-400">
                          {item.category.replace("-", " ")}
                        </span>
                        {item.organization && <span>• {item.organization}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded">
                          NEW
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Dark Mode + Alert Badge */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Switcher */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-xl transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search input when screen is small */}
      <div className="sm:hidden px-4 pb-2.5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Sarkari Jobs, Results, Admit Card..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            className="w-full bg-blue-950/90 text-white placeholder:text-blue-300/70 text-xs rounded-full pl-9 pr-4 py-2 border border-blue-400/30 focus:outline-none"
          />
          <Search className="w-4 h-4 text-blue-300 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Mobile search dropdown */}
        {isSearchOpen && searchQuery.trim().length >= 2 && (
          <div className="mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 text-slate-800 dark:text-slate-100 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {searchResults.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSearchResultClick(item.category, item.slug)}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-slate-800 flex flex-col"
              >
                <span className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                  {item.title}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 capitalize">
                  {item.category.replace("-", " ")}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Horizontal Nav Bar (Desktop) */}
      <nav className="hidden lg:block bg-[#082255] border-t border-blue-900/60 text-xs font-semibold overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
          {navLinks.map((tab) => {
            const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3.5 py-2.5 whitespace-nowrap transition-all relative ${
                  isActive
                    ? "text-amber-300 font-bold bg-blue-950/70 border-b-2 border-amber-400"
                    : "text-blue-100 hover:text-white hover:bg-blue-800/40"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Slide-in Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-72 bg-[#0A2A66] text-white flex flex-col min-h-screen shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-blue-900">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-rose-600 flex items-center justify-center font-bold text-white text-sm">
                  OW
                </div>
                <span className="font-bold text-sm tracking-wide uppercase">Online Wallah</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-1">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                Navigation
              </p>
              {navLinks.map((tab) => {
                const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                        : "text-blue-100 hover:bg-blue-800"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-6 border-t border-blue-900/80 space-y-2">
              <a
                href="https://t.me/onlinewallah"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-sky-500/20 text-sky-200 rounded-lg text-xs font-semibold"
              >
                <Send className="w-4 h-4" />
                <span>Telegram Exam Channel</span>
              </a>
              <a
                href="https://whatsapp.com/channel/onlinewallah"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 text-emerald-200 rounded-lg text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Job Alerts</span>
              </a>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
