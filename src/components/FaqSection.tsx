import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FaqItemItem {
  question: string;
  answer: React.ReactNode;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItemItem[] = [
    {
      question: "How to calculate age?",
      answer: (
        <div className="space-y-2">
          <p>To calculate age accurately, follow these steps:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Enter your birth date in the first field using the simple calendar picker.</li>
            <li>Enter the target date you want to calculate your age as of (defaults to current date).</li>
            <li>Click the <strong>Calculate Age</strong> button to see your exact age in years, months, and days.</li>
          </ul>
        </div>
      )
    },
    {
      question: "Can I use this to find what day I was born?",
      answer: (
        <div className="space-y-2">
          <p>Yes! The age calculator automatically tells you the exact day of the week you were born on:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Enter your date of birth.</li>
            <li>Press Calculate.</li>
            <li>The dashboard will instantly display the weekday of your birth date (e.g., Monday, Thursday etc) in the badge indicator next to your age header.</li>
          </ul>
        </div>
      )
    },
    {
      question: "How can I create a link to share my age?",
      answer: (
        <div className="space-y-2">
          <p>You can generate a shareable link that includes your date of birth so others can view your exact age, weekday born, and astrological information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Enter your birth date in the calculator.</li>
            <li>Wait for the url field in the bottom-left card to sync, or click <strong>Generate Link</strong>.</li>
            <li>Click <strong>Copy</strong>, and paste the generated address to share it with anyone!</li>
          </ul>
        </div>
      )
    },
    {
      question: "Why use an age calculator?",
      answer: (
        <div className="space-y-2">
          <p>An age calculator is extremely useful for: </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Quickly determining exact age for professional forms and applications.</li>
            <li>Verifying target eligibility conditions for government records or school enrollment.</li>
            <li>Planning birthday parties, understanding astrological planetary periods, or vastu calculations.</li>
          </ul>
        </div>
      )
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
          Learn how calculations are constructed
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
            >
              <button
                onClick={() => handleToggle(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                id={`faq-btn-${idx}`}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
