import React, { useEffect, useState } from 'react';
import { Search, Bookmark, Sun, Moon, Terminal, Menu, X } from 'lucide-react';
import { ViewMode } from '../../types';
import { ReadingProgressBar } from '../common/ReadingProgressBar';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenCommandPalette: () => void;
  bookmarkCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCommandPalette,
  bookmarkCount,
  isDarkMode,
  onToggleTheme,
  isMobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const pct = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
      setScrollProgress(Math.round(pct));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { view: ViewMode; label: string }[] = [
    { view: 'roadmaps', label: 'Roadmaps' },
    { view: 'cheatsheets', label: 'Cheat Sheets' },
    { view: 'projects', label: 'Project Ideas' },
    { view: 'tools', label: 'Tool Directory' },
    { view: 'architecture', label: 'Schema & Specs' },
  ];

  // Colors tailored to the documentation page
  const getProgressBarColor = () => {
    if (currentView === 'cheatsheets') return 'amber';
    if (currentView === 'projects') return 'violet';
    if (currentView === 'architecture') return 'cyan';
    return 'cyan';
  };

  const isDocumentationView = ['cheatsheets', 'projects', 'architecture', 'roadmaps'].includes(currentView);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8 relative">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-neutral-100 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <span>Kri Tech</span>
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action cluster (Search, Bookmarks, Theme toggle) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Active Reading Progress Indicator for long pages */}
          {isDocumentationView && scrollProgress > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
              <span className={`font-semibold tabular-nums ${
                currentView === 'cheatsheets' ? 'text-amber-400' : currentView === 'projects' ? 'text-violet-400' : 'text-cyan-400'
              }`}>
                {scrollProgress}%
              </span>
              <span>read</span>
            </div>
          )}

          {/* Quick Search Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors cursor-pointer"
            title="Open command palette (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search Vault...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1 py-0.2 text-[10px] font-mono text-neutral-400 bg-neutral-800 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Bookmarks Counter Button */}
          <button
            onClick={() => onNavigate('bookmarks')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
              currentView === 'bookmarks'
                ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/40'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent'
            }`}
            title="View saved resources"
          >
            <Bookmark className="w-3.5 h-3.5" />
            {bookmarkCount > 0 && (
              <span className="font-mono text-[11px] tabular-nums font-semibold text-cyan-400">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Dark/Light mode toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Reading Progress Bar pinned along the bottom edge of Navbar */}
      {isDocumentationView && (
        <div className="w-full absolute bottom-0 left-0">
          <ReadingProgressBar colorScheme={getProgressBarColor()} />
        </div>
      )}

      {/* Mobile drawer navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                onNavigate(item.view);
                onToggleMobileMenu();
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                currentView === item.view
                  ? 'bg-neutral-900 text-cyan-400 font-medium'
                  : 'text-neutral-300 hover:bg-neutral-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
