import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Share2, 
  Trash2, 
  Plus, 
  Sparkles, 
  MessageSquare, 
  Copy, 
  Check, 
  UserPlus, 
  Bell, 
  BellOff, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import Header from "./components/Header";
import TimelineVisualization from "./components/TimelineVisualization";
import HeroSection from "./components/HeroSection";
import ProductSections from "./components/ProductSections";
import FaqSection from "./components/FaqSection";
import ToolsHub from "./components/ToolsHub";
import { 
  calculateAge, 
  reverseCalculateDob, 
  formatDateString, 
  parseLocalMidnightDate 
} from "./utils/dateCalculators";
import { SavedEvent } from "./types";
import { 
  triggerLocalPushNotification, 
  requestNotificationPermission 
} from "./utils/notifications";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  // Mode state: 'today' | 'specific' | 'findDob'
  const [currentMode, setCurrentMode] = useState<"today" | "specific" | "findDob">("today");

  // Input states
  const [birthDate, setBirthDate] = useState<string>("2002-07-04");
  const [specificTargetDate, setSpecificTargetDate] = useState<string>(() => formatDateString(new Date()));
  
  // Find DOB input states
  const [findAgeY, setFindAgeY] = useState<string>("23");
  const [findAgeM, setFindAgeM] = useState<string>("11");
  const [findAgeD, setFindAgeD] = useState<string>("9");
  const [referenceDate, setReferenceDate] = useState<string>(() => formatDateString(new Date()));

  // Saved events book for Birthdays tracker
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(() => {
    const local = localStorage.getItem("saved_birthdays");
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // Fallback to defaults
      }
    }
    return [
      { id: "1", name: "Sophia Miller", birthDate: "2002-07-04", notifyBeforeDays: 3, isNotificationEnabled: true },
      { id: "2", name: "David Chen", birthDate: "1994-11-20", notifyBeforeDays: 0, isNotificationEnabled: true },
      { id: "3", name: "Amelia Watson", birthDate: "1988-03-12", notifyBeforeDays: 7, isNotificationEnabled: false }
    ];
  });

  // Adding new birthday event state
  const [newEventName, setNewEventName] = useState<string>("");
  const [newEventDob, setNewEventDob] = useState<string>("1998-05-15");
  const [newEventNotifyDays, setNewEventNotifyDays] = useState<number>(3);

  // Notifications toggles
  const [notificationsAllowed, setNotificationsAllowed] = useState<boolean>(false);
  const [globalNotificationEnabled, setGlobalNotificationEnabled] = useState<boolean>(true);

  // Shared Link value state
  const [shareableUrl, setShareableUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Copied metric indicator
  const [copiedMetric, setCopiedMetric] = useState<string | null>(null);

  // Gemini AI generated analysis states
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem("gemini_api_key") || "";
  });
  const [aiReportType, setAiReportType] = useState<"lifepath" | "party" | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponseText, setAiResponseText] = useState<string>("");
  const [aiError, setAiError] = useState<string>("");
  const [copiedAiText, setCopiedAiText] = useState<boolean>(false);

  // SaaS scheduling mock slots selection
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Modals visibility toggles (Login & Register simulations)
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("alinoorullah16@gmail.com");
  const [loginPass, setLoginPass] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("is_logged_in") === "true";
    }
    return false;
  });
  const [loggedInEmail, setLoggedInEmail] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("logged_in_email") || "alinoorullah16@gmail.com";
    }
    return "alinoorullah16@gmail.com";
  });

  const handleSimulateLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("logged_in_email");
    triggerToast("Logged out successfully from Time-Taker Calendar.");
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize system mode light / dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Request native permission check on mount
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationsAllowed(Notification.permission === "granted");
    }
    
    // Parse URL query parameters if present to preload age calculations
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    if (modeParam === "today" || modeParam === "specific" || modeParam === "findDob") {
      setCurrentMode(modeParam as any);
      
      if (modeParam === "today" || modeParam === "specific") {
        const dobVal = params.get("dob");
        if (dobVal) setBirthDate(dobVal);
        const targetVal = params.get("target");
        if (targetVal) setSpecificTargetDate(targetVal);
      } else {
        const y = params.get("y");
        const m = params.get("m");
        const d = params.get("d");
        const ref = params.get("ref");
        if (y) setFindAgeY(y);
        if (m) setFindAgeM(m);
        if (d) setFindAgeD(d);
        if (ref) setReferenceDate(ref);
      }
    }
  }, []);

  // Sync saved birthday list changes to localStorage
  useEffect(() => {
    localStorage.setItem("saved_birthdays", JSON.stringify(savedEvents));
  }, [savedEvents]);

  // Handle toast scheduling
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Perform calculations based on state values
  const results = (() => {
    if (currentMode === "today" || currentMode === "specific") {
      const target = currentMode === "today" ? formatDateString(new Date()) : specificTargetDate;
      return calculateAge(birthDate, target);
    } else {
      const yVal = Math.max(0, parseInt(findAgeY) || 0);
      const mVal = Math.max(0, parseInt(findAgeM) || 0);
      const dVal = Math.max(0, parseInt(findAgeD) || 0);
      return reverseCalculateDob(yVal, mVal, dVal, referenceDate);
    }
  })();

  // Synchronize Share URL dynamically
  useEffect(() => {
    const origin = window.location.origin + window.location.pathname;
    let query = `?mode=${currentMode}`;
    if (currentMode === "today") {
      query += `&dob=${birthDate}`;
    } else if (currentMode === "specific") {
      query += `&dob=${birthDate}&target=${specificTargetDate}`;
    } else {
      query += `&y=${findAgeY}&m=${findAgeM}&d=${findAgeD}&ref=${referenceDate}`;
    }
    setShareableUrl(origin + query);
  }, [currentMode, birthDate, specificTargetDate, findAgeY, findAgeM, findAgeD, referenceDate]);

  // Actions
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    triggerToast("Dashboard configuration link copied safely!");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyMetric = (value: number, key: string, label: string) => {
    navigator.clipboard.writeText(value.toString());
    setCopiedMetric(key);
    triggerToast(`${label} value (${value.toLocaleString()}) copied cleanly!`);
    setTimeout(() => {
      setCopiedMetric(current => current === key ? null : current);
    }, 2000);
  };

  // Push notification permission prompt
  const handleEnableNotificationPermission = async () => {
    const isGranted = await requestNotificationPermission();
    setNotificationsAllowed(isGranted);
    if (isGranted) {
      triggerToast("Desktop notify protocol permitted! Alerts will trigger on events.");
      triggerLocalPushNotification(
        "DaySchedule Enabled! 🔔",
        "Birthdays tracking status and exact timeline reports are now live."
      );
    } else {
      triggerToast("Permission denied or dismissed by system.");
    }
  };

  // Custom birthday insertion
  const handleAddBirthday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) {
      triggerToast("Please supply a valid contact name.");
      return;
    }
    const newly: SavedEvent = {
      id: Date.now().toString(),
      name: newEventName.trim(),
      birthDate: newEventDob,
      notifyBeforeDays: newEventNotifyDays,
      isNotificationEnabled: true
    };
    setSavedEvents((prev) => [...prev, newly]);
    setNewEventName("");
    triggerToast(`Created event tracking for ${newly.name}!`);

    // Check if celebration occurs today or matches trigger immediately
    if (newly.notifyBeforeDays === 0) {
      const dobDate = parseLocalMidnightDate(newly.birthDate);
      const today = new Date();
      if (dobDate.getMonth() === today.getMonth() && dobDate.getDate() === today.getDate()) {
        triggerLocalPushNotification(
          "Upcoming Celebration! 🎈",
          `Today is ${newly.name}'s birthday! 🎉 Successfully registered on DaySchedule.`
        );
      }
    }
  };

  const handleRemoveBirthday = (id: string, name: string) => {
    setSavedEvents((prev) => prev.filter((it) => it.id !== id));
    triggerToast(`Removed tracking registry for ${name}.`);
  };

  const toggleEventNotification = (id: string) => {
    setSavedEvents((prev) => 
      prev.map((it) => (it.id === id ? { ...it, isNotificationEnabled: !it.isNotificationEnabled } : it))
    );
  };

  // Simulated slot triggers
  const handleSelectSlot = (time: string, type: string) => {
    setSelectedSlot(time);
    triggerToast(`Demo Session booked at ${time} (${type})! Confirmation sent to your email.`);
    
    // Check if push permitted
    triggerLocalPushNotification(
      "Booking Confirmed! 🗓️",
      `Your slot for ${type} at ${time} has been registered via DaySchedule®.`
    );
  };

  // AI Cosmic Insights generation - Proxied server-side fetch with elegant prompt
  const handleGenerateAiInsights = async (type: "lifepath" | "party") => {
    setAiReportType(type);
    setAiLoading(true);
    setAiResponseText("");
    setAiError("");

    if (customApiKey) {
      localStorage.setItem("gemini_api_key", customApiKey);
    }

    const systemPrompt = 
      type === "lifepath" 
      ? `Act as a professional temporal strategist and chronological consultant. Analyze individual demographic timelines and provide an inspiring, highly professional chronological report. Avoid overly mystical tone; focus on temporal milestones, generation cohort trends, and scheduling advice. Format into clean, short markdown blocks. Limit response to 230 words.`
      : `Act as a premium events director and corporate experience planner. Create highly organized party concept sequences and email invitations. Emphasize dynamic schedule integration through DaySchedule. Limit to 230 words.`;

    const userQuery = 
      type === "lifepath"
      ? `Create a custom time-management profile for someone lived ${results.years} Years, ${results.months} Months, and ${results.days} Days. Born weekday: ${results.weekdayBorn}, Western Zodiac: ${results.zodiacSign}, Generative Cohort: ${results.generationCohort}. Detail: 1) Demographics & Timeline strengths, 2) Three specific time-management routines for DaySchedule.`
      : `Plan a high-concept celebration for someone turning ${results.nextBirthdayAge} soon. Born in the ${results.generationCohort} era. Supply: 1) Creative Party Concept, 2) Step-by-step Event Sequence, 3) Beautiful text email template inviting colleagues using DaySchedule reservation URLs.`;

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          userQuery,
          customApiKey: customApiKey || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setAiResponseText(data.text);
        triggerToast("AI Analysis computed successfully!");
      } else {
        if (data.error === "API_KEY_MISSING") {
          // Robust Fallback Simulation
          throw new Error("KEY_MISSING");
        }
        throw new Error(data.error || "Generation endpoint refused query.");
      }
    } catch (err: any) {
      if (err.message === "KEY_MISSING") {
        // High fidelity procedural fallback report
        setTimeout(() => {
          setAiResponseText(getSimulatedReportText(type, results));
          triggerToast("Simulated timeline analysis generated! (Add Gemini API key for live responses)");
          setAiLoading(false);
        }, 840);
      } else {
        console.error(err);
        setAiError("Could not calculate AI report. Verify your internet configuration or key.");
        setAiLoading(false);
      }
    } finally {
      if (customApiKey) {
        setAiLoading(false);
      }
    }
  };

  const getSimulatedReportText = (type: "lifepath" | "party", calculated: typeof results) => {
    if (type === "lifepath") {
      return `### ⚡ Chronological Development Profile
      
You have safely navigated **${calculated.years} years, ${calculated.months} months, and ${calculated.days} days** of your earthly itinerary. Having launched on a **${calculated.weekdayBorn}**, you align with the astrological archetype of **${calculated.zodiacSign}** and fall into the sociological cohort of **${calculated.generationCohort}**.

**Demographic Strength Highlights:**
- **Inherent Resilience**: Your demographic markers display strong analytical skills, adaptability to cloud-first paradigms, and a native desire for deep work blocks.
- **Milestone Maturity**: At this juncture, stabilizing sleep-to-productivity cycles serves as your greatest competitive advantage.

**Recommended DaySchedule Routine Refinements:**
1. **Dynamic 15-Min Buffer Windows**: Allocate strict gaps between consecutive consults to shield focus.
2. **Weekly Retrospective Scheduling**: Reserve afternoon segments for scheduling review.
3. **Optimized Availability Zones**: Limit meeting options to Tuesday through Thursday to focus on creative tasks in consolidated windows.`;
    } else {
      return `### 🎈 Milestone Birthday Concept & Scheduling Brief

**Chronology-Themed Gala: Elegant Transitions**
Celebrate your dynamic passage into **Turning ${calculated.nextBirthdayAge}**! Since you belong to the **${calculated.generationCohort}** era, the party centers on nostalgic media highlights matching your childhood years with future-focused trends.

**Event Sequence Blueprint:**
- **19:00 - Guest Reception**: Digital arrival windows verified by DaySchedule dynamic check-in codes.
- **20:30 - Retro Interactive Trivia**: Icebreakers detailing historic cultural headlines and tech benchmarks from your birth year.
- **22:00 - Lunar Crossover Toast**: Cake presentation specifying your exact duration in minutes.

**Invitation Template Draft:**
\`\`\`
Subject: Access Granted: Register for my Milestone Gala!

Hi team,

I am officially completing another solar orbit and turning ${calculated.nextBirthdayAge}! To commemorate, I am hosting a chronology-inspired Chronology Gala.

Please secure your preferred attendance slot via my DaySchedule registry below so I can coordinate refreshments:
[Insert DaySchedule URL]

See you on the timeline,
- Admin
\`\`\``;
    }
  };

  const copyAiReportText = () => {
    navigator.clipboard.writeText(aiResponseText);
    setCopiedAiText(true);
    triggerToast("AI Report text copied to clipboard!");
    setTimeout(() => setCopiedAiText(false), 2500);
  };

  // Convert markdown-ish text to basic elements
  const renderAiText = (rawStr: string) => {
    return rawStr
      .split("\n\n")
      .map((block, i) => {
        if (block.startsWith("###")) {
          return (
            <h4 key={i} className="text-sm font-extrabold text-[#3b82f6] dark:text-blue-400 border-b border-slate-800 pb-1 mb-2">
              {block.slice(3).trim()}
            </h4>
          );
        }
        if (block.startsWith("-") || block.startsWith("*")) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1 mb-2 text-xs">
              {block.split("\n").map((li, j) => (
                <li key={j}>{li.replace(/^[\s-*]+/, "").trim()}</li>
              ))}
            </ul>
          );
        }
        if (block.startsWith("1.") || block.startsWith("2.") || block.startsWith("3.")) {
          return (
            <ol key={i} className="list-decimal pl-5 space-y-1 mb-2 text-xs font-medium text-slate-300">
              {block.split("\n").map((li, j) => (
                <li key={j}>{li.replace(/^\d+\.\s*/, "").trim()}</li>
              ))}
            </ol>
          );
        }
        if (block.startsWith("```")) {
          return (
            <pre key={i} className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[10px] font-mono whitespace-pre-wrap overflow-x-auto text-blue-300 leading-relaxed mb-2">
              {block.replace(/```[a-z]*\n?/g, "").trim()}
            </pre>
          );
        }
        return <p key={i} className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 font-medium">{block}</p>;
      });
  };

  // Compute percentage elapsed since last birthday
  const birthdayProgressPercentage = (() => {
    const dob = parseLocalMidnightDate(results.birthDate);
    const today = parseLocalMidnightDate(results.targetDate);
    
    // Last birthday
    let lastBdayYear = today.getFullYear();
    let lastBday = new Date(lastBdayYear, dob.getMonth(), dob.getDate(), 0, 0, 0, 0);
    if (lastBday > today) {
      lastBday.setFullYear(lastBdayYear - 1);
    }

    // Next birthday
    let nextBday = new Date(lastBday.getFullYear() + 1, dob.getMonth(), dob.getDate(), 0, 0, 0, 0);

    const yearDuration = nextBday.getTime() - lastBday.getTime();
    const elapsed = today.getTime() - lastBday.getTime();
    
    const percent = Math.min(100, Math.max(0, (elapsed / yearDuration) * 100));
    return Math.round(percent);
  })();

  const handleSimulateLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setLoggedInEmail(loginEmail);
    localStorage.setItem("is_logged_in", "true");
    localStorage.setItem("logged_in_email", loginEmail);
    setShowLoginModal(false);
    triggerToast(`Logged in successfully as ${loginEmail}!`);
  };

  const handleSimulateRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setLoggedInEmail(loginEmail);
    localStorage.setItem("is_logged_in", "true");
    localStorage.setItem("logged_in_email", loginEmail);
    setShowRegisterModal(false);
    triggerToast(`Profile registered! Welcome to the premium Time-Taker Calendar Suite.`);
    triggerLocalPushNotification(
      "Welcome aboard! ✈️",
      "Your Time-Taker Calendar account is established. Enjoy premium precise age tracking."
    );
  };

  return (
    <div className={`min-h-screen bg-[#F3F4F6] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-blue-600/10`}>
      
      {/* Absolute Dynamic Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white dark:bg-white dark:text-slate-950 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 text-xs font-extrabold animate-bounce leading-none">
          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping"></span>
          {toastMessage}
        </div>
      )}

      {/* Header component */}
      <Header 
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onNavigateToHub={() => {
          document.getElementById("tools-hub")?.scrollIntoView({ behavior: "smooth" });
        }}
        onShowLoginModal={() => setShowLoginModal(true)}
        onShowRegisterModal={() => setShowRegisterModal(true)}
        isLoggedIn={isLoggedIn}
        loggedInEmail={loggedInEmail}
        onLogout={handleSimulateLogout}
      />

      {/* Hero section */}
      <HeroSection />

      {/* Main Core Form & Analytics Grid Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ==================== LEFT FIELD PANEL: SIDEBAR INPUT PANELS ==================== */}
          <section className="col-span-1 lg:col-span-4 flex flex-col space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl shadow-sm space-y-6 transition-all">
              
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-sm"></span>
                  Time-Taker Calculator
                </h2>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  CONFIGURE MEASUREMENT MODE
                </p>
              </div>

              {/* Mode Nav tab-pills */}
              <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-lg gap-1 border border-slate-200/50 dark:border-slate-800">
                <button 
                  onClick={() => setCurrentMode("today")}
                  className={`flex-1 py-2 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                    currentMode === "today" 
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  id="tab-today"
                >
                  Age Today
                </button>
                <button 
                  onClick={() => setCurrentMode("specific")}
                  className={`flex-1 py-2 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                    currentMode === "specific" 
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  id="tab-specific"
                >
                  Specific Date
                </button>
                <button 
                  onClick={() => setCurrentMode("findDob")}
                  className={`flex-1 py-2 rounded-md text-[11px] font-extrabold transition-all cursor-pointer ${
                    currentMode === "findDob" 
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  id="tab-find-dob"
                >
                  Find DOB
                </button>
              </div>

              {/* Responsive Calendar inputs */}
              <div className="space-y-4">
                
                {/* MODE 1 & 2: Date of Birth Input Picker */}
                {(currentMode === "today" || currentMode === "specific") && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label htmlFor="dob-input" className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                        DATE OF BIRTH
                      </label>
                      <span className="text-[9px] font-extrabold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-150/40">
                        UTC-SAFE
                      </span>
                    </div>
                    <div className="relative">
                      <input 
                        type="date"
                        id="dob-input"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* MODE 2 SPECIFIC: Target Specific Date Calendar */}
                {currentMode === "specific" && (
                  <div>
                    <label htmlFor="target-specific-date" className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-1.5">
                      TARGET DATE
                    </label>
                    <input 
                      type="date"
                      id="target-specific-date"
                      value={specificTargetDate}
                      onChange={(e) => setSpecificTargetDate(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 outline-none"
                    />
                  </div>
                )}

                {/* MODE 3 FIND DOB: Elapsed parameters */}
                {currentMode === "findDob" && (
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-400 font-semibold italic">
                      Subtract elapsed age factors from reference point to deduce birth date.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label htmlFor="input-age-y" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 text-center">
                          YEARS
                        </label>
                        <input 
                          type="number"
                          id="input-age-y"
                          min="0"
                          max="150"
                          value={findAgeY}
                          onChange={(e) => setFindAgeY(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="input-age-m" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 text-center">
                          MONTHS
                        </label>
                        <input 
                          type="number"
                          id="input-age-m"
                          min="0"
                          max="11"
                          value={findAgeM}
                          onChange={(e) => setFindAgeM(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="input-age-d" className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 text-center">
                          DAYS
                        </label>
                        <input 
                          type="number"
                          id="input-age-d"
                          min="0"
                          max="30"
                          value={findAgeD}
                          onChange={(e) => setFindAgeD(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-center text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="input-ref-date" className="block text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-1.5">
                        REFERENCE DATE
                      </label>
                      <input 
                        type="date"
                        id="input-ref-date"
                        value={referenceDate}
                        onChange={(e) => setReferenceDate(e.target.value)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ==================== ⚡ CHRONOMETRIC PRESETS SYSTEM ==================== */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Time-Taker Presets</span>
                </div>
                
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
                  Click any demo timeline profile below to instantly load exact birthdates and recalculate total months, hours, and astrological signs:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setBirthDate("2026-01-15");
                      setCurrentMode("today");
                      triggerToast("👶 Integrated Preset: Newborn Infant (Born Jan 2026)!");
                    }}
                    className="p-2 text-left text-[11px] rounded-lg border border-slate-150 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-semibold flex items-center gap-1.5 cursor-pointer text-slate-755 dark:text-slate-300"
                    type="button"
                  >
                    <span className="text-sm">👶</span>
                    <div className="truncate">
                      <span className="block font-bold leading-normal">Newborn Infant</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">2026-01-15</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setBirthDate("2002-07-04");
                      setCurrentMode("today");
                      triggerToast("💻 Integrated Preset: Gen Z Graduate (Born 2002)!");
                    }}
                    className="p-2 text-left text-[11px] rounded-lg border border-slate-150 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-semibold flex items-center gap-1.5 cursor-pointer text-slate-755 dark:text-slate-300"
                    type="button"
                  >
                    <span className="text-sm">💻</span>
                    <div className="truncate">
                      <span className="block font-bold leading-normal">Gen Z Graduate</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">2002-07-04</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setBirthDate("1988-06-12");
                      setCurrentMode("today");
                      triggerToast("💼 Integrated Preset: Millennial Leader (Born 1988)!");
                    }}
                    className="p-2 text-left text-[11px] rounded-lg border border-slate-150 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-semibold flex items-center gap-1.5 cursor-pointer text-slate-755 dark:text-slate-300"
                    type="button"
                  >
                    <span className="text-sm">💼</span>
                    <div className="truncate">
                      <span className="block font-bold leading-normal">Millennial Pro</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">1988-06-12</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setBirthDate("1976-06-13");
                      setCurrentMode("today");
                      triggerToast("🏛️ Integrated Preset: Golden Jubilee (Born 1976)!");
                    }}
                    className="p-2 text-left text-[11px] rounded-lg border border-slate-150 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-semibold flex items-center gap-1.5 cursor-pointer text-slate-755 dark:text-slate-300"
                    type="button"
                  >
                    <span className="text-sm">🏛️</span>
                    <div className="truncate">
                      <span className="block font-bold leading-normal">Golden Jubilee</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">1976-06-13</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* ==================== 🔒 ACCOUNT & QUICK SIGN-IN CENTER ==================== */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                    Account Status
                  </span>
                  
                  {isLoggedIn ? (
                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      ★ Active Subscriber
                    </span>
                  ) : (
                    <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Demo Mode
                    </span>
                  )}
                </div>

                {isLoggedIn ? (
                  <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 p-4 rounded-xl space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-base">✅</span>
                      <div>
                        <span className="block text-xs font-bold text-slate-900 dark:text-white leading-normal">
                          Authenticated Workspace
                        </span>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          Registered: {loggedInEmail}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-slate-400 font-semibold leading-normal">
                      Plan: <strong className="text-emerald-600 dark:text-emerald-400">E-15 Premium Plan ($15/mo)</strong> active with lifetime database access.
                    </div>

                    <button
                      onClick={handleSimulateLogout}
                      className="w-full py-1.5 rounded-lg border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/25 text-[10px] font-extrabold text-red-500 transition-colors cursor-pointer"
                      type="button"
                    >
                      Sign Out Account
                    </button>
                  </div>
                ) : (
                  <div className="bg-indigo-50/40 dark:bg-indigo-950/25 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-xl space-y-2">
                    <p className="text-[10px] text-indigo-950 dark:text-indigo-250 font-bold leading-normal">
                      For school and business presentations: Log in or Sign Up below to unlock precise calendar exports.
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setIsLoggedIn(true);
                          setLoggedInEmail("alinoorullah16@gmail.com");
                          localStorage.setItem("is_logged_in", "true");
                          localStorage.setItem("logged_in_email", "alinoorullah16@gmail.com");
                          triggerToast("🔑 Easy 1-Click Login Authenticated!");
                        }}
                        className="py-2 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold text-center transition-all shadow-sm cursor-pointer"
                        type="button"
                      >
                        🔑 Quick Login
                      </button>

                      <button
                        onClick={() => {
                          setIsLoggedIn(true);
                          setLoggedInEmail("student.hc@edu.org");
                          localStorage.setItem("is_logged_in", "true");
                          localStorage.setItem("logged_in_email", "student.hc@edu.org");
                          triggerToast("📝 Easy 1-Click Free Sign Up Completed!");
                          triggerLocalPushNotification(
                            "Welcome to Time-Taker! 🗓️",
                            "Enjoy educational and corporate presentation features."
                          );
                        }}
                        className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold text-center transition-all cursor-pointer"
                        type="button"
                      >
                        📝 Quick Sign Up
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Share box parameters */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <span>Share Timeline Profile</span>
                  <button 
                    onClick={handleCopyLink}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Get Link
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-[10px] font-mono text-slate-500 text-ellipsis focus:outline-none"
                  />
                  <button 
                    onClick={handleCopyLink}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                      copiedLink 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400" 
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-705 hover:bg-slate-50"
                    }`}
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop notification permit card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl shadow-sm space-y-4 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    Push Notifications
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                    ALERTS & SCHEDULE PROMPTS
                  </p>
                </div>
                
                <button
                  onClick={handleEnableNotificationPermission}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    notificationsAllowed 
                    ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400" 
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600 dark:bg-slate-950"
                  }`}
                  title={notificationsAllowed ? "Notifications Allowed" : "Grant notification permission"}
                >
                  {notificationsAllowed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <span className="font-semibold text-slate-600 dark:text-slate-350">
                  Global Alert Engine Status
                </span>
                <button 
                  onClick={() => {
                    setGlobalNotificationEnabled(!globalNotificationEnabled);
                    triggerToast(`Global alert system state: ${!globalNotificationEnabled ? "ONLINE" : "MUTED"}`);
                  }}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer relative ${
                    globalNotificationEnabled ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <div 
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      globalNotificationEnabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">
                {notificationsAllowed 
                  ? "✓ Active desktop protocols verified. Upcoming birthdays trigger alert prompts natively."
                  : "ⓘ Allow browser notification privileges to receive precise countdown alerts before events."
                }
              </p>
            </div>

            {/* Birthday Registry Contact Book (Local Persistence) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl shadow-sm space-y-4 transition-all">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                  Birthday Tracker Book
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                  ENTERPRISE COLLABORATION
                </p>
              </div>

              {/* Event book list */}
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {savedEvents.map((ev) => (
                  <div 
                    key={ev.id}
                    className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs flex justify-between items-center group transition-all"
                  >
                    <div className="space-y-0.5 max-w-[70%]">
                      <p className="font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">
                        {ev.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">
                        {ev.birthDate} ({ev.notifyBeforeDays === 0 ? "Exact Day" : `${ev.notifyBeforeDays} days prior`})
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => toggleEventNotification(ev.id)}
                        className={`p-1 rounded text-[10px] transition-colors cursor-pointer ${
                          ev.isNotificationEnabled 
                          ? "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40" 
                          : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title={ev.isNotificationEnabled ? "Alert active" : "Alert muted"}
                      >
                        {ev.isNotificationEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                      </button>
                      <button 
                        onClick={() => handleRemoveBirthday(ev.id, ev.name)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {savedEvents.length === 0 && (
                  <p className="text-[11px] text-slate-400 text-center italic py-4">
                    Empty directory. Fill the fields below to capture birthdays.
                  </p>
                )}
              </div>

              {/* Add event small form */}
              <form onSubmit={handleAddBirthday} className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
                    <input 
                      type="text"
                      placeholder="Sophia..."
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-semibold text-slate-850 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Birth Date</label>
                    <input 
                      type="date"
                      value={newEventDob}
                      onChange={(e) => setNewEventDob(e.target.value)}
                      className="w-full p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-semibold text-slate-850 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-between col-span-2">
                  <div className="w-[60%]">
                    <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Notify Alerts</label>
                    <select
                      value={newEventNotifyDays}
                      onChange={(e) => setNewEventNotifyDays(Number(e.target.value))}
                      className="w-full p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <option value="0">Exact Birthday Day</option>
                      <option value="1">1 Day Ahead</option>
                      <option value="3">3 Days Ahead</option>
                      <option value="7">7 Days Ahead</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-1.5 px-3.5 rounded-md flex items-center gap-1 transition-all shadow-sm cursor-pointer self-end"
                  >
                    <Plus className="w-3 h-3" />
                    Register
                  </button>
                </div>
              </form>

            </div>

          </section>

          {/* ==================== RIGHT SIDE: METRIC HEADERS, PROGRESS BARS, AI ADVISORY ==================== */}
          <section className="col-span-1 lg:col-span-8 flex flex-col space-y-6">
            
            {/* Main Calculated Results Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-sm p-6 sm:p-8 space-y-6 transition-all">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {currentMode === "findDob" ? "DEDUCED DATE OF BIRTH" : "CURRENT CALCULATED AGE"}
                  </p>
                  
                  {currentMode === "findDob" ? (
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none" id="find-dob-output-text">
                      {results.birthDate ? (
                        <>
                          {new Date(results.birthDate).toLocaleDateString(undefined, {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </>
                      ) : (
                        "--"
                      )}
                    </h1>
                  ) : (
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none" id="age-metric-main">
                      {results.years} <span className="text-2xl font-light text-slate-400 select-none">Years</span> {results.months} <span className="text-2xl font-light text-slate-400 select-none">Months</span>
                    </h1>
                  )}

                  <p className="text-blue-600 dark:text-blue-400 font-extrabold text-sm flex items-center gap-1">
                    <span>•</span>
                    Born on a {results.weekdayBorn}
                  </p>
                </div>

                <div className="h-12 w-px bg-slate-150 dark:bg-slate-800 hidden sm:block"></div>

                <div className="sm:text-right space-y-0.5 group">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
                    Total Duration
                  </span>
                  <div className="flex items-center sm:justify-end gap-1.5">
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                      {results.totalDays.toLocaleString()}
                    </p>
                    <button 
                      onClick={() => handleCopyMetric(results.totalDays, "days", "Total Days")}
                      className="p-1 rounded bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 border border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer h-7 w-7 flex items-center justify-center shadow-xs"
                      title="Copy raw Total Days count"
                      type="button"
                    >
                      {copiedMetric === "days" ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    Exact Days Old
                  </p>
                </div>
              </div>

              {/* Detailed duration stat boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex flex-col justify-between group relative min-h-[5.5rem]">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase block mb-1">Total Weeks</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none">
                      {results.totalWeeks.toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleCopyMetric(results.totalWeeks, "weeks", "Total Weeks")}
                    className="absolute bottom-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-750 shadow-2xs"
                    title="Copy raw Total Weeks count"
                    type="button"
                  >
                    {copiedMetric === "weeks" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex flex-col justify-between group relative min-h-[5.5rem]">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase block mb-1 font-semibold">Total Months</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none">
                      {results.totalMonths.toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleCopyMetric(results.totalMonths, "months", "Total Months")}
                    className="absolute bottom-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-750 shadow-2xs"
                    title="Copy raw Total Months count"
                    type="button"
                  >
                    {copiedMetric === "months" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex flex-col justify-between group relative min-h-[5.5rem]">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase block mb-1">Total Hours</span>
                    <p className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none">
                      {results.totalHours.toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleCopyMetric(results.totalHours, "hours", "Total Hours")}
                    className="absolute bottom-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-755 shadow-2xs"
                    title="Copy raw Total Hours count"
                    type="button"
                  >
                    {copiedMetric === "hours" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex flex-col justify-between min-h-[5.5rem]">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-555 uppercase block mb-1">Current Modality</span>
                    <p className="text-sm font-black text-blue-600 dark:text-blue-400 leading-none h-4">
                      {currentMode === "today" ? "Age Today 🗓️" : currentMode === "specific" ? "Target Specific" : "Calculated DOB 🔍"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Astrological signs & demographics tags bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/40 px-3.5 py-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/60 font-medium">
                  <span className="text-base select-none">♋</span>
                  <span>
                    Astrological Zodiac Sign:{" "}
                    <strong className="text-slate-900 dark:text-white font-bold">
                      {results.zodiacSign}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/40 px-3.5 py-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/60 font-medium">
                  <span className="text-base select-none">⚡</span>
                  <span>
                    Generative Cohort Group:{" "}
                    <strong className="text-slate-900 dark:text-white font-bold">
                      {results.generationCohort}
                    </strong>
                  </span>
                </div>
              </div>

            </div>

            {/* Interactive Timeline Visualization Panel */}
            <TimelineVisualization 
              birthDate={birthDate}
              targetDate={currentMode === "specific" ? specificTargetDate : results.targetDate}
              results={results}
              savedEvents={savedEvents}
            />

            {/* SLEEK NEXT BIRTHDAY PANEL (Dark Geometric Design Theme) */}
            <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-md">
              
              {/* Glowing circular overlay vector */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 -mr-32 -mt-32 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                      COUNTDOWN TO AGE {results.nextBirthdayAge}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {results.nextBirthdayDate}
                    </h3>
                  </div>

                  <div className="bg-white/10 px-4 py-2 rounded-full border border-white/25 shrink-0">
                    <span className="text-white text-xs font-extrabold font-mono tracking-tight leading-none block">
                      {results.nextBirthdayDaysRemaining} Days To Go
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${birthdayProgressPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-slate-400">
                      Progress Since Last Anniversary
                    </span>
                    <span className="text-blue-400 font-mono">
                      {birthdayProgressPercentage}% Complete
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* ✨ GEMINI GENERATIVE INSIGHTS PANEL */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg border border-indigo-900/40">
              <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
                <Sparkles className="w-60 h-60 text-indigo-400" />
              </div>

              <div className="relative z-10 space-y-4">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-indigo-900/30 pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-[10px] text-blue-300 font-extrabold uppercase">
                      <span className="w-1.5 h-1.5 rounded bg-emerald-400 animate-ping"></span>
                      Powered by Gemini 3.5 Flash
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                      AI Cosmic Insights & Life Planning
                    </h3>
                  </div>

                  {/* Optional Key drawer */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="key-field" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Custom API Key:
                    </label>
                    <input 
                      type="password"
                      id="key-field"
                      placeholder="Optional Custom Key..."
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      className="bg-slate-950/80 border border-slate-800 text-[10px] text-slate-100 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 font-semibold"
                    />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  Leverage cutting-edge space computing to read temporal markers. Compose detailed life paths, time schedules, and high-conversion colleague invitation emails based on demographic milestones.
                </p>

                {/* AI Trigger buttons */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleGenerateAiInsights("lifepath")}
                    disabled={aiLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-3 rounded-lg transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Compute Life Path Advice
                  </button>
                  <button 
                    onClick={() => handleGenerateAiInsights("party")}
                    disabled={aiLoading}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold px-4 py-3 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Draft Invitation & Party Logic
                  </button>
                </div>

                {/* Loader State */}
                {aiLoading && (
                  <div className="space-y-2.5 pt-4 animate-pulse">
                    <div className="h-4 bg-slate-800/80 rounded w-full"></div>
                    <div className="h-4 bg-slate-800/80 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-800/80 rounded w-4/6"></div>
                  </div>
                )}

                {/* Error Box */}
                {aiError && (
                  <div className="bg-red-950/40 border border-red-900/55 p-4 rounded-lg text-xs text-red-300 font-semibold italic">
                    {aiError}
                  </div>
                )}

                {/* AI Result Container */}
                {aiResponseText && !aiLoading && (
                  <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-5 space-y-4 shadow-inner max-h-96 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                        {aiReportType === "lifepath" ? "✓ LIFE PATH REPORT" : "✓ PARTY SCHEDULE SCHEMAS"}
                      </span>

                      <button 
                        onClick={copyAiReportText}
                        className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded hover:text-white text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedAiText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy Analysis
                      </button>
                    </div>

                    <div className="space-y-3 prose prose-invert max-w-none text-slate-300">
                      {renderAiText(aiResponseText)}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* PRODUCT CTA: Branded appointment booking promo */}
            <div className="bg-slate-950 text-white rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg">
              
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-16 -translate-y-10">
                <div className="w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Branded DaySchedule Availability
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                    Create your free appointment booking website
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                    Start accepting bookings online with your own branded scheduling page. No coding required - set up, share your link, and get booked instantly.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setShowRegisterModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-3 rounded-lg transition-all cursor-pointer"
                    >
                      Create Free Account →
                    </button>
                    <button 
                      onClick={() => triggerToast("Direct product tour simulation live! Review availability choice on right")}
                      className="bg-slate-800 hover:bg-slate-705 border border-slate-700 text-white text-xs font-bold px-4 py-3 rounded-lg transition-all"
                    >
                      Book a Demo
                    </button>
                  </div>
                </div>

                {/* Simulated booking widget */}
                <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-xl">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                        DaySchedule Widget
                      </p>
                      <span className="text-xs font-bold text-white">Select premium choice</span>
                    </div>

                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.0 py-0.5 rounded-full font-bold">
                      Available
                    </span>
                  </div>

                  {/* Chosen slot choices listing */}
                  <div className="space-y-2 text-xs">
                    <button 
                      onClick={() => handleSelectSlot("10:00 AM (EST)", "1:1 Strategy Meeting")}
                      className={`w-full p-2.5 rounded-lg text-left transition-all border flex justify-between items-center cursor-pointer ${
                        selectedSlot === "10:00 AM (EST)" 
                        ? "bg-blue-600 border-blue-500 text-white shadow" 
                        : "bg-slate-850 hover:bg-slate-800 text-slate-350 border-slate-800"
                      }`}
                    >
                      <span className="font-bold">10:00 AM (EST)</span>
                      <span className="text-[9px] text-slate-450 block font-semibold uppercase font-mono">
                        1:1 Strategy
                      </span>
                    </button>

                    <button 
                      onClick={() => handleSelectSlot("02:30 PM (EST)", "Enterprise Product Demo")}
                      className={`w-full p-2.5 rounded-lg text-left transition-all border flex justify-between items-center cursor-pointer ${
                        selectedSlot === "02:30 PM (EST)" 
                        ? "bg-blue-600 border-blue-500 text-white shadow" 
                        : "bg-slate-850 hover:bg-slate-800 text-slate-350 border-slate-800"
                      }`}
                    >
                      <span className="font-bold">02:30 PM (EST)</span>
                      <span className="text-[9px] text-slate-455 block font-semibold uppercase font-mono">
                        Product Demo
                      </span>
                    </button>

                    <button 
                      onClick={() => handleSelectSlot("04:00 PM (EST)", "Private Vastu Consultation")}
                      className={`w-full p-2.5 rounded-lg text-left transition-all border flex justify-between items-center cursor-pointer ${
                        selectedSlot === "04:00 PM (EST)" 
                        ? "bg-blue-600 border-blue-500 text-white shadow" 
                        : "bg-slate-850 hover:bg-slate-800 text-slate-350 border-slate-800"
                      }`}
                    >
                      <span className="font-bold">04:00 PM (EST)</span>
                      <span className="text-[9px] text-slate-455 block font-semibold uppercase font-mono">
                        Consultation
                      </span>
                    </button>
                  </div>

                  {selectedSlot && (
                    <div className="text-center text-[10px] text-blue-300 font-bold bg-blue-950/30 border border-blue-900/30 p-2 rounded-lg">
                      Reserved Segment: {selectedSlot} matches DaySchedule Registry.
                    </div>
                  )}

                </div>

              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px] text-slate-500 font-medium">
                <span>Trusted by 25,000+ businesses worldwide</span>
                <span>Active Global Hub</span>
              </div>

            </div>

          </section>

        </div>
      </main>

      {/* Simple Clean Footer */}
      <footer className="bg-slate-950 text-slate-500 text-xs border-t border-slate-900 py-10 transition-colors font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-sm font-extrabold tracking-tight">
              Time-Taker
              <span className="text-blue-500 font-bold text-xs">®</span>
            </span>
          </div>
          
          <p className="text-slate-500 font-semibold text-[11px] text-center sm:text-left">
            © 2026 HC Chronology & Time-Taker System. All rights reserved. Registered trademark. Used for professional and educational presentation purposes.
          </p>

          <div className="flex gap-4 font-bold text-[11px]">
            <span className="bg-slate-900 border border-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded text-[9px]">
              time-taker.hc
            </span>
          </div>
        </div>
      </footer>

      {/* Login Modal Simulation */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl w-full max-w-sm m-4 space-y-4 shadow-2xl text-slate-800 dark:text-neutral-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Sign in to Time-Taker Calendar®
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    ENTERPRISE CONTROL DESK
                  </p>
                </div>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-black text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSimulateLogin} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Password</label>
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-850 dark:text-white"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow cursor-pointer"
                  >
                    Authenticate Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Register Modal Simulation */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl w-full max-w-sm m-4 space-y-4 shadow-2xl text-slate-800 dark:text-neutral-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Create your Free Workspace
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    NO CREDIT CARD REQUIRED
                  </p>
                </div>
                <button 
                  onClick={() => setShowRegisterModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-black text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSimulateRegister} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Enterprise Email</label>
                  <input 
                    type="email"
                    required
                    defaultValue="alinoorullah16@gmail.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-850 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Desired Workspace Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Acme Org"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1 text-[10px] text-slate-500 leading-tight">
                  <input type="checkbox" required defaultChecked className="mt-0.5" />
                  <span>I agree to the terms of service and consent to precise temporal logging.</span>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow cursor-pointer"
                  >
                    Establish Account Dashboard
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
