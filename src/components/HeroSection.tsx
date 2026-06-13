import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-950/40 py-12 border-b border-slate-200 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-4">
          <span className="hover:text-blue-600 cursor-pointer">Calculators</span>
          <span>&gt;</span>
          <span className="text-slate-600 dark:text-slate-300 font-bold">HC Chronology System</span>
        </nav>
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
          id="hero-title"
        >
          Time-Taker Calendar & Chronology Calculator
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 max-w-2xl mx-auto font-medium"
          id="hero-subtitle"
        >
          Experience an elite date, time, and human chronology (HC) calculator designed for academic, school, or corporate presentations. Formulate exact milestones, total hours, and count down upcoming solar anniversaries with absolute mathematical precision.
        </motion.p>
      </div>
    </section>
  );
}
