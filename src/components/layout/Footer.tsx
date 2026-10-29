import React from 'react';
import { ViewMode } from '../../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
  onOpenCommandPalette: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCommandPalette }) => {
  return (
    <footer className="w-full border-t border-neutral-800/80 bg-neutral-950 mt-auto py-10 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm">
              <span>Kri Tech</span>
              <span className="text-neutral-500 font-normal">·</span>
              <span className="text-neutral-400 text-xs font-normal">Tech & Developer Resource Hub</span>
            </div>
            <p className="mt-1 text-neutral-400 text-xs max-w-md">
              Curated learning paths, high-performance cheat sheets, technical portfolio blueprints, and modern developer tooling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-400">
            <button
              onClick={() => onNavigate('roadmaps')}
              className="hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Roadmaps
            </button>
            <button
              onClick={() => onNavigate('cheatsheets')}
              className="hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Cheat Sheets
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Project Ideas
            </button>
            <button
              onClick={() => onNavigate('tools')}
              className="hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Tool Directory
            </button>
            <button
              onClick={() => onNavigate('architecture')}
              className="hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Prisma Schema & Specs
            </button>
            <button
              onClick={onOpenCommandPalette}
              className="hover:text-neutral-200 transition-colors cursor-pointer font-mono"
            >
              Search (⌘K)
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 text-[11px]">
          <div>
            Built for developers and Computer Science engineers
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span>Next.js App Router Architecture</span>
            <span>·</span>
            <span>Prisma ORM</span>
            <span>·</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
