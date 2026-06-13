import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onNavigateToHub: () => void;
  onShowLoginModal: () => void;
  onShowRegisterModal: () => void;
  isLoggedIn?: boolean;
  loggedInEmail?: string;
  onLogout?: () => void;
}

export default function Header({
  darkMode,
  toggleDarkMode,
  onNavigateToHub,
  onShowLoginModal,
  onShowRegisterModal,
  isLoggedIn = false,
  loggedInEmail = "",
  onLogout = () => {}
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* logo */}
          <div className="flex items-center gap-3">
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-0.5 animate-fade-in">
                Time-Taker
                <span className="text-blue-600 font-bold text-xs select-none">®</span>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Light / Dark toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}

