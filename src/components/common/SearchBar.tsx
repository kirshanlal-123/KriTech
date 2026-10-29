import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  showKbdShortcut?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search roadmaps, cheat sheets, projects, tools...',
  onFocus,
  showKbdShortcut = true,
  className = '',
  autoFocus = false,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(internalValue);
    }, 150);
    return () => clearTimeout(handler);
  }, [internalValue, onChange]);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-neutral-400 pointer-events-none" />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onFocus={onFocus}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-2.5 text-sm rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 transition-colors"
      />
      <div className="absolute right-3 flex items-center gap-1.5">
        {internalValue && (
          <button
            onClick={() => {
              setInternalValue('');
              onChange('');
            }}
            aria-label="Clear search"
            className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {showKbdShortcut && (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-800 border border-neutral-700/60 rounded">
            <span>⌘</span>K
          </kbd>
        )}
      </div>
    </div>
  );
};
