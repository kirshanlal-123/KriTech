import React, { useEffect, useState, useRef } from 'react';
import { Search, Compass, FileCode, FolderGit2, Wrench, ArrowRight, X } from 'lucide-react';
import { searchAllResources } from '../../lib/fuseSearch';
import { UnifiedSearchItem, ViewMode } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewMode, targetId?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = searchAllResources(query, 10);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          const item = results[selectedIndex];
          onNavigate(item.targetView, item.targetId);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onNavigate, onClose]);

  if (!isOpen) return null;

  const getTypeIcon = (type: UnifiedSearchItem['type']) => {
    switch (type) {
      case 'roadmap':
        return <Compass className="w-4 h-4 text-cyan-400 shrink-0" />;
      case 'cheatsheet':
        return <FileCode className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'project':
        return <FolderGit2 className="w-4 h-4 text-violet-400 shrink-0" />;
      case 'tool':
        return <Wrench className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
  };

  const getTypeLabel = (type: UnifiedSearchItem['type']) => {
    switch (type) {
      case 'roadmap':
        return 'Roadmap';
      case 'cheatsheet':
        return 'Cheat Sheet';
      case 'project':
        return 'Project';
      case 'tool':
        return 'Tool';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-neutral-800">
          <Search className="w-4 h-4 text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword, tech, tool name, or roadmap..."
            className="w-full bg-transparent text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-neutral-800/40">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-neutral-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.targetView, item.targetId);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-neutral-800 text-neutral-100' : 'hover:bg-neutral-800/60 text-neutral-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div className="mt-0.5">{getTypeIcon(item.type)}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-neutral-100 truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-neutral-500 shrink-0">
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-neutral-500">
                        <span>{item.category}</span>
                        {item.tags.slice(0, 3).map((tag, tIdx) => (
                          <React.Fragment key={tIdx}>
                            <span aria-hidden="true">·</span>
                            <span className="text-neutral-400">{tag}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 mt-1 transition-transform shrink-0 ${
                      isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-neutral-600'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-800 bg-neutral-950/80 text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-4">
            <span><kbd className="text-neutral-400">↑↓</kbd> navigate</span>
            <span><kbd className="text-neutral-400">↵</kbd> select</span>
            <span><kbd className="text-neutral-400">esc</kbd> close</span>
          </div>
          <span className="text-neutral-400 font-sans">Kri Tech Fuzzy Index</span>
        </div>
      </div>
    </div>
  );
};
