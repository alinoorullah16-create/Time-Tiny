import { useState } from "react";
import { Clock, QrCode, Hourglass, CalendarRange } from "lucide-react";
import { motion } from "motion/react";

export default function ToolsHub() {
  // Unix Converter State
  const [unixInput, setUnixInput] = useState<string>("1774886400"); // Standard timestamp for some future date
  const [unixLocal, setUnixLocal] = useState<string>("");
  const [unixGmt, setUnixGmt] = useState<string>("");

  // QR Code generator state
  const [qrText, setQrText] = useState<string>("https://dayschedule.com/demo");
  const [showQr, setShowQr] = useState<boolean>(true);

  // Time Difference State
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:30");
  const [timeDiffResult, setTimeDiffResult] = useState<string>("");

  // Age Difference State
  const [compareDate1, setCompareDate1] = useState<string>("2002-07-04");
  const [compareDate2, setCompareDate2] = useState<string>("2010-10-15");
  const [compareResult, setCompareResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    olderDate: string;
    youngerDate: string;
  } | null>(null);

  const parseLocalMidnightDate = (dateString: string): Date => {
    const [y, m, d] = dateString.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  };

  const handleConvertUnix = () => {
    if (!unixInput) return;
    try {
      const val = parseInt(unixInput);
      if (isNaN(val)) {
        setUnixLocal("Invalid Number");
        setUnixGmt("Invalid Number");
        return;
      }
      const date = new Date(val * 1000);
      setUnixLocal(date.toLocaleString());
      setUnixGmt(date.toUTCString());
    } catch {
      setUnixLocal("Error parsing");
      setUnixGmt("Error parsing");
    }
  };

  const handleTimeDifference = () => {
    if (!startTime || !endTime) return;
    try {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      let diffMinutes = eh * 60 + em - (sh * 60 + sm);
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // adjust for next day transition
      }
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      setTimeDiffResult(`${hours} Hours, ${mins} Minutes`);
    } catch {
      setTimeDiffResult("Error calculating");
    }
  };

  const handleCompareAges = () => {
    if (!compareDate1 || !compareDate2) return;
    try {
      const d1 = parseLocalMidnightDate(compareDate1);
      const d2 = parseLocalMidnightDate(compareDate2);
      
      let earlier = d1;
      let later = d2;
      let earlierStr = compareDate1;
      let laterStr = compareDate2;
      
      if (d1.getTime() > d2.getTime()) {
        earlier = d2;
        later = d1;
        earlierStr = compareDate2;
        laterStr = compareDate1;
      } else if (d1.getTime() === d2.getTime()) {
        setCompareResult({
          years: 0,
          months: 0,
          days: 0,
          totalDays: 0,
          olderDate: compareDate1,
          youngerDate: compareDate2
        });
        return;
      }
      
      let years = later.getFullYear() - earlier.getFullYear();
      let months = later.getMonth() - earlier.getMonth();
      let days = later.getDate() - earlier.getDate();
      
      if (days < 0) {
        const previousMonth = new Date(later.getFullYear(), later.getMonth(), 0);
        days += previousMonth.getDate();
        months--;
      }
      
      if (months < 0) {
        months += 12;
        years--;
      }
      
      const diffTime = later.getTime() - earlier.getTime();
      const totalDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      
      setCompareResult({
        years,
        months,
        days,
        totalDays,
        olderDate: earlierStr,
        youngerDate: laterStr
      });
    } catch {
      // Ignore
    }
  };

  return (
    <section id="tools-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Interactive Free Tools Hub
        </h2>
        <p className="text-xs text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest">
          BUILT-IN PRODUCTIVITY COMPANIONS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        
        {/* Tool 1: Unix Converter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Unix Timestamp Converter
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                  Unix Epoch Timestamp
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={unixInput}
                    onChange={(e) => setUnixInput(e.target.value)}
                    placeholder="e.g. 1774886400"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-semibold text-slate-800 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={handleConvertUnix}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Convert
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 text-xs space-y-2 font-semibold font-mono text-slate-500 dark:text-slate-400">
                <div className="truncate">
                  Local:{" "}
                  <span className="text-slate-850 dark:text-white font-bold block sm:inline">
                    {unixLocal || "Click convert"}
                  </span>
                </div>
                <div className="truncate">
                  GMT/UTC:{" "}
                  <span className="text-slate-850 dark:text-white font-bold block sm:inline">
                    {unixGmt || "Click convert"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tool 2: Easy Meeting QR Code */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-lg">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                SaaS Event QR Generator
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                  DaySchedule / Event Link URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => {
                      setQrText(e.target.value);
                      setShowQr(true);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="https://dayschedule.com/..."
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800/80 min-h-[96px]">
                {showQr && qrText ? (
                  <div className="text-center">
                    <svg
                      width="72"
                      height="72"
                      viewBox="0 0 100 100"
                      className="mx-auto text-slate-800 dark:text-slate-200"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Positioning boundaries */}
                      <rect x="0" y="0" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="6" y="6" width="16" height="16" fill="currentColor" />
                      
                      <rect x="72" y="0" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="78" y="6" width="16" height="16" fill="currentColor" />
                      
                      <rect x="0" y="72" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="6" y="78" width="16" height="16" fill="currentColor" />
                      
                      {/* Bits pattern */}
                      <rect x="36" y="10" width="8" height="8" fill="currentColor" />
                      <rect x="48" y="20" width="12" height="12" fill="currentColor" />
                      <rect x="14" y="38" width="16" height="8" fill="currentColor" />
                      <rect x="42" y="42" width="12" height="12" fill="currentColor" />
                      <rect x="78" y="38" width="8" height="16" fill="currentColor" />
                      <rect x="38" y="78" width="16" height="8" fill="currentColor" />
                      <rect x="78" y="78" width="12" height="12" fill="currentColor" />
                      <rect x="58" y="58" width="8" height="8" fill="currentColor" />
                      <rect x="10" y="54" width="8" height="8" fill="currentColor" />
                      <rect x="54" y="10" width="8" height="8" fill="currentColor" />
                    </svg>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                      Scan for celebration info
                    </p>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    No URL specified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tool 3: Time Difference Calculator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 rounded-lg">
                <Hourglass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Time Difference Calculator
              </h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              
              <button
                onClick={handleTimeDifference}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                Calculate Difference
              </button>
              
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
                Result:{" "}
                <span className="font-bold text-slate-850 dark:text-white" id="time-diff-output">
                  {timeDiffResult || "Calculate to see metric"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tool 4: Age Compare Difference Calculator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 rounded-lg">
                <CalendarRange className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Age Comparison Tool
              </h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                    Birthdate 1
                  </label>
                  <input
                    type="date"
                    value={compareDate1}
                    onChange={(e) => setCompareDate1(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
                    Birthdate 2
                  </label>
                  <input
                    type="date"
                    value={compareDate2}
                    onChange={(e) => setCompareDate2(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <button
                onClick={handleCompareAges}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer"
              >
                Compare Ages
              </button>
              
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 text-center text-[11px] text-slate-550 dark:text-slate-400 min-h-[58px] flex flex-col justify-center items-center">
                {compareResult ? (
                  <div className="space-y-1">
                    <p className="font-black text-slate-850 dark:text-white text-xs">
                      {compareResult.years}y, {compareResult.months}m, {compareResult.days}d difference
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      ({compareResult.totalDays.toLocaleString()} total days gap)
                    </p>
                  </div>
                ) : (
                  <span className="font-semibold text-slate-500">
                    Compare two birthdays
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
