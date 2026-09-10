"use client";

import { useState } from "react";
import { Calculator, CheckCircle, Calendar, Sparkles } from "lucide-react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-01");
  const [asOnDate, setAsOnDate] = useState("2026-08-01");
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob || !asOnDate) return;

    const birthDate = new Date(dob);
    const targetDate = new Date(asOnDate);

    if (birthDate > targetDate) {
      alert("Date of Birth cannot be later than the target date.");
      return;
    }

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAgeResult({ years, months, days });
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 md:p-6 shadow-xl border border-blue-700/50">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-bold shadow-md">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Sarkari Exam Age Calculator
          </h3>
          <p className="text-xs text-blue-200">
            Check your exact age as on UPSC / SSC / Railway cutoff date
          </p>
        </div>
      </div>

      <form onSubmit={calculateAge} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5">
          <label className="block text-[11px] font-semibold text-blue-200 mb-1">
            Your Date of Birth (DOB)
          </label>
          <input
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3 py-2 bg-blue-950/90 border border-blue-500/50 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="sm:col-span-5">
          <label className="block text-[11px] font-semibold text-blue-200 mb-1">
            Age Calculated As On Date
          </label>
          <input
            type="date"
            required
            value={asOnDate}
            onChange={(e) => setAsOnDate(e.target.value)}
            className="w-full px-3 py-2 bg-blue-950/90 border border-blue-500/50 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button
            type="submit"
            className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Calculate
          </button>
        </div>
      </form>

      {ageResult && (
        <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs text-blue-200 font-medium">Your exact age as on {asOnDate}:</p>
              <p className="text-lg font-black text-amber-300 tracking-wide">
                {ageResult.years} Years, {ageResult.months} Months, {ageResult.days} Days
              </p>
            </div>
          </div>
          <span className="text-[11px] text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            ✓ Eligible for general 18-32 exams
          </span>
        </div>
      )}
    </div>
  );
}
