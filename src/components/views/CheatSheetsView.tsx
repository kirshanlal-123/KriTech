import React, { useState, useEffect } from 'react';
import { FileCode, Search, ExternalLink, Bookmark, ArrowUp } from 'lucide-react';
import { CheatSheet } from '../../types';
import { CHEATSHEETS_DATA } from '../../data/cheatsheetsData';
import { CodeBlock } from '../common/CodeBlock';
import { ReadingProgressBar } from '../common/ReadingProgressBar';

interface CheatSheetsViewProps {
  initialCheatSheetId?: string;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const CheatSheetsView: React.FC<CheatSheetsViewProps> = ({
  initialCheatSheetId,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [selectedTech, setSelectedTech] = useState<string>(
    initialCheatSheetId
      ? CHEATSHEETS_DATA.find((c) => c.id === initialCheatSheetId)?.technology || 'All'
      : 'All'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Languages', 'Databases', 'Bundlers & Tools', 'DevOps & Terminal'];
  const allTechnologies = ['All', ...Array.from(new Set(CHEATSHEETS_DATA.map((c) => c.technology)))];

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setScrollProgress(0);
        return;
      }
      const pct = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
      setScrollProgress(Math.round(pct));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter sheets
  const filteredSheets = CHEATSHEETS_DATA.filter((cs) => {
    const matchesCategory = selectedCategory === 'All' || cs.category === selectedCategory;
    const matchesTech = selectedTech === 'All' || cs.technology === selectedTech;
    const matchesSearch =
      searchQuery.trim() === '' ||
      cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cs.snippets.some(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.explanation.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesTech && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <FileCode className="w-7 h-7 text-amber-400" />
            <span>Searchable Cheat Sheet Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Production-grade syntax snippets, modern idioms, and concurrency patterns with 1-click clipboard copy.
          </p>
        </div>

        {/* Live Filter Search */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search syntax or pattern..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80"
          />
        </div>
      </div>

      {/* Filter Category & Tech Selection Bar */}
      <div className="space-y-3">
        {/* Category Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-amber-400 shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Technology Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono text-neutral-400">Technology:</span>
          {allTechnologies.map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-2.5 py-1 text-xs rounded-md font-mono transition-colors cursor-pointer ${
                selectedTech === tech
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* Reading Progress Indicator Bar for Cheat Sheet Vault */}
      <div className="rounded-lg bg-neutral-900/60 border border-neutral-800/80 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-400 font-mono">
          <span className="text-amber-400 font-semibold">Vault Reading Progress:</span>
          <span className="text-neutral-200 tabular-nums">{scrollProgress}% scrolled</span>
          <span className="text-neutral-600">·</span>
          <span>{filteredSheets.length} Technologies in view</span>
        </div>
        <div className="w-full sm:w-48 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 transition-all duration-100"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Cheat Sheet Vault Content */}
      {filteredSheets.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-neutral-900/40 border border-neutral-800 text-neutral-400 text-sm">
          No cheat sheets found matching &ldquo;{searchQuery || selectedTech}&rdquo;. Try another filter.
        </div>
      ) : (
        <div className="space-y-10">
          {filteredSheets.map((sheet) => {
            const isBookmarked = bookmarkedIds.includes(sheet.id);

            return (
              <div
                key={sheet.id}
                className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-6"
              >
                {/* Sheet Title Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800/80">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
                      <span>{sheet.category}</span>
                      <span>·</span>
                      <span className="text-amber-400">{sheet.technology}</span>
                    </div>
                    <h2 className="text-xl font-bold text-neutral-100">{sheet.title}</h2>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl">
                      {sheet.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleBookmark(sheet.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-950/60 border-amber-800/60 text-amber-400'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark Sheet'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <a
                      href={sheet.officialDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs text-neutral-200 hover:text-white transition-colors"
                    >
                      <span>Docs</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Snippets in this sheet */}
                <div className="space-y-6">
                  {sheet.snippets.map((snip) => (
                    <div key={snip.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-neutral-200 font-mono">
                          {snip.title}
                        </h3>
                        {snip.tags && (
                          <div className="flex items-center gap-1.5">
                            {snip.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <CodeBlock
                        code={snip.code}
                        language={snip.language}
                        title={`${sheet.technology} · ${snip.title}`}
                      />

                      <p className="text-xs text-neutral-400 pl-1 leading-relaxed">
                        {snip.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Reading Progress & Back to Top button */}
      {scrollProgress > 15 && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-mono text-neutral-200 shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
          <span>{scrollProgress}% read</span>
          <span className="text-neutral-500">·</span>
          <span className="text-amber-400 font-sans text-[11px]">Top ↑</span>
        </button>
      )}

    </div>
  );
};
