import React from "react";
import { 
  Check, 
  HelpCircle, 
  Layers, 
  ShieldCheck, 
  GraduationCap, 
  TrendingUp, 
  Zap, 
  Building2, 
  Cable, 
  Heart, 
  CheckCircle2, 
  Crown 
} from "lucide-react";

export default function ProductSections() {
  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ================= PRODUCTS BLOCK ================= */}
      <section id="products" className="scroll-mt-20 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] bg-blue-500/10 dark:bg-blue-400/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            Core Utilities
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Our Chronological Products
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Discover our fully modular chronometric engines engineered for classrooms and enterprise team scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all group">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl w-fit">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              Human Age Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Ultra-precision solar orbit arithmetic. Breaks ages down to total months, weeks, days, and absolute hours with automatic leap-day adjustments.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all group">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
              Educational Cohorts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Categorizes generational paradigms (Millennial, Gen Z, Alpha) instantly. Perfect for academic research slides, demographic studies, and sociology papers.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all group">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
              Dynamic Milestone Scales
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Leverages interactive modular D3.js coordinates to track life intervals, adjacent months, historic planetary periods, and custom alerts.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all group">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
              <Cable className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
              Appointment Bridges
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Permits direct integration with booking links and responsive local push notifications to alert you prior to events.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PRICING: E-15 BLOCK ================= */}
      <section id="pricing" className="scroll-mt-20 space-y-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/80">
        <div className="text-center space-y-2">
          <span className="text-[10px] bg-emerald-500/10 dark:bg-emerald-400/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            Acre-Grade Budget Plans
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Transparent Pricing Plans
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Choose free educational licensing, or upgrade to the classic E-15 professional plan for advanced corporate tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Plan 1: Free Academic */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] bg-slate-100 dark:bg-slate-950 text-slate-500 border border-slate-200 dark:border-slate-800 px-2.5 py-0.5 rounded font-extrabold uppercase">
                  Classroom Use
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Academic License
                </h3>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">$0</span>
                <span className="text-xs text-slate-450 font-bold">/ free forever</span>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                Perfect for students, teachers, homework assignments, or private individual chronology evaluation.
              </p>

              <hr className="border-slate-100 dark:border-slate-800/60" />

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350 font-semibold text-[11px]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Exact Age Calculations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>D3 Interactive Proximity Scales</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Generational & Zodiac Tags</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400 line-through">
                  <span>No Custom API Keys Storage</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => alert("Welcome to the Academic License! Your default access is already active and free.")}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Default Active Free
            </button>
          </div>

          {/* Plan 2: Best Choice - E-15 Pro */}
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-2xl p-6 space-y-6 relative flex flex-col justify-between shadow-lg">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-300" />
              RECOMMENDED SPECIFICATION
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 px-2.5 py-0.5 rounded font-extrabold uppercase">
                  Elite Business
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  The E-15 Professional Plan
                </h3>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">$15</span>
                <span className="text-xs text-slate-500 font-bold">/ per month</span>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                Our elite professional standard. Gain advanced calendar integrations, local databases, and brand-building widgets.
              </p>

              <hr className="border-slate-100 dark:border-slate-800/60" />

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350 font-semibold text-[11px]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Everything in Free</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full Lifetime D3 Scaler Views</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Contact Birthday Tracker Registry</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Custom Gemini API Keys Integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dynamic Shareable Link Configurator</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => alert("Demo Simulation Mode: Starting direct $15/mo checkout flow...")}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Get E-15 Pro Workspace
            </button>
          </div>

          {/* Plan 3: Enterprise Team */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 px-2.5 py-0.5 rounded font-extrabold uppercase">
                  Institutional
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Enterprise Org
                </h3>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">$49</span>
                <span className="text-xs text-slate-450 font-bold">/ per month</span>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                Tailored for business heads, teams, and schools needing maximum uptime parameters and database structures.
              </p>

              <hr className="border-slate-100 dark:border-slate-800/60" />

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350 font-semibold text-[11px]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Everything in E-15</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dedicated Subdomain Deployments</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>SLA Guarantee Priority Support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Institutional Database Backups</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={() => alert("Simulation Mode: Enterprise setup initiated. Our representative will contact you.")}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Inquire Enterprise
            </button>
          </div>

        </div>
      </section>

      {/* ================= ENTERPRISE TEAM & DETAILS BLOCK ================= */}
      <section id="enterprise" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-slate-200/50 dark:border-slate-800/80">
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest block">
              Academic & Business Standards
            </span>
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Viable Human Chronology Engineering For Teams
          </h2>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Time-Taker Calendar and the HC Chronologics framework were designed to remove the complex guesswork from calendar pipelines. Schools use our systems to illustrate historic time intervals, while corporations use us to track milestones, timezone gaps, and scheduling slots safely.
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Our technology has been thoroughly reviewed and benchmarked with robust, fail-safe state machines that avoid any unexpected runtime crashes. Perfect for critical demonstrations.
          </p>

          <div className="flex gap-4">
            <div className="text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex-1">
              <span className="text-lg font-black text-blue-600 font-mono block">99.99%</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">Chronology Uptime</span>
            </div>
            <div className="text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex-1">
              <span className="text-lg font-black text-emerald-600 font-mono block">25k+</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">Registered Users</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Security & Administration Credentials
          </h3>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            We operate fully sandboxed local storage configurations ensuring that family birthdates, colleague records, and custom API keys are strictly saved inside your client browser, avoiding any external surveillance leakage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 dark:text-white">Strict Data Anonymity</span>
                <p className="text-[10px] text-slate-400 leading-normal">Your IDs and personal calendar entries never traverse insecure cloud pathways.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 dark:text-white">ISO Chronology Compliant</span>
                <p className="text-[10px] text-slate-400 leading-normal">Calculates leap days, Gregorian shifts, and year cycles in direct UTC harmony.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTEGRATIONS BLOCK ================= */}
      <section id="integrations" className="scroll-mt-20 space-y-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/80 pb-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] bg-purple-500/10 dark:bg-purple-400/15 border border-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
            Connected Systems
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Universal Calendaring Integrations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Sync your dynamic HC calculations and saved countdown timers into the industry's default schedule managers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 group hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer" onClick={() => alert("Google Calendar integration ready to sync on production deploy.")}>
            <span className="text-white bg-red-500 p-2 rounded-lg text-xs font-black">G</span>
            <span className="font-bold text-xs text-slate-800 dark:text-white">Google Calendar</span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Supported</span>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 group hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer" onClick={() => alert("Microsoft Outlook integration ready to sync on production deploy.")}>
            <span className="text-white bg-blue-500 p-2 rounded-lg text-xs font-black">O</span>
            <span className="font-bold text-xs text-slate-800 dark:text-white">Microsoft Outlook</span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Supported</span>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 group hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer" onClick={() => alert("Apple iCal integration format validated.")}>
            <span className="text-white bg-slate-900 dark:bg-slate-950 p-2 rounded-lg text-xs font-black">iCal</span>
            <span className="font-bold text-xs text-slate-800 dark:text-white">Apple Calendar</span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Supported</span>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 group hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer" onClick={() => alert("Gemini API scheduling is ready to parse countdown intervals.")}>
            <span className="text-white bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg text-xs font-black">AI</span>
            <span className="font-bold text-xs text-slate-800 dark:text-white">Gemini Insights</span>
            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">Active Engine</span>
          </div>
        </div>
      </section>

    </div>
  );
}
