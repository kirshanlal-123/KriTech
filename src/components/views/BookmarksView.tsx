import React from 'react';
import { Bookmark, Compass, FileCode, FolderGit2, Wrench, ArrowRight, Trash2 } from 'lucide-react';
import { ViewMode, NodeStatus } from '../../types';
import { ROADMAPS_DATA } from '../../data/roadmapsData';
import { CHEATSHEETS_DATA } from '../../data/cheatsheetsData';
import { PROJECTS_DATA } from '../../data/projectsData';
import { TOOLS_DATA } from '../../data/toolsData';

interface BookmarksViewProps {
  bookmarkedIds: string[];
  nodeStatuses: Record<string, NodeStatus>;
  onToggleBookmark: (id: string) => void;
  onNavigate: (view: ViewMode, targetId?: string) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedIds,
  nodeStatuses,
  onToggleBookmark,
  onNavigate,
}) => {
  // Find saved items across collections
  const savedCheatSheets = CHEATSHEETS_DATA.filter((cs) => bookmarkedIds.includes(cs.id));
  const savedProjects = PROJECTS_DATA.filter((p) => bookmarkedIds.includes(p.id));
  const savedTools = TOOLS_DATA.filter((t) => bookmarkedIds.includes(t.id));

  // Compute overall learning metrics
  const totalMasteredNodes = Object.values(nodeStatuses).filter((s) => s === 'mastered').length;
  const totalInProgressNodes = Object.values(nodeStatuses).filter((s) => s === 'in_progress').length;

  const totalSaved = savedCheatSheets.length + savedProjects.length + savedTools.length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-cyan-400" />
            <span>My Learning Hub & Saved Resources</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Track your personalized curriculum progress and quick-access your bookmarked technical assets.
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
          <span className="text-cyan-400 font-bold tabular-nums">{totalSaved}</span> Bookmarked Assets
        </div>
      </div>

      {/* Curriculum Mastery KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
          <div className="text-xs font-mono text-neutral-400">Mastered Roadmap Competencies</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {totalMasteredNodes}
          </div>
          <p className="text-[11px] text-neutral-500">Verified through interactive roadmaps</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
          <div className="text-xs font-mono text-neutral-400">Active Learning Targets</div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {totalInProgressNodes}
          </div>
          <p className="text-[11px] text-neutral-500">Currently in progress</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
          <div className="text-xs font-mono text-neutral-400">Saved Tools & Projects</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {totalSaved}
          </div>
          <p className="text-[11px] text-neutral-500">Pinned for quick reference</p>
        </div>
      </div>

      {totalSaved === 0 ? (
        <div className="p-12 text-center rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-3">
          <Bookmark className="w-8 h-8 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-300">No saved resources yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Click the bookmark icon on any cheat sheet, portfolio project idea, or developer tool to save it here for fast access.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigate('cheatsheets')}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
            >
              Explore Cheat Sheets
            </button>
            <button
              onClick={() => onNavigate('tools')}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
            >
              Explore Tools
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Saved Cheat Sheets */}
          {savedCheatSheets.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-semibold uppercase text-neutral-400 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>Saved Cheat Sheets ({savedCheatSheets.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCheatSheets.map((cs) => (
                  <div
                    key={cs.id}
                    className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-mono text-amber-400">{cs.technology}</div>
                      <h4 className="text-sm font-semibold text-neutral-100">{cs.title}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{cs.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onNavigate('cheatsheets', cs.id)}
                        className="px-3 py-1 text-xs rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => onToggleBookmark(cs.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Projects */}
          {savedProjects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-semibold uppercase text-neutral-400 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-violet-400" />
                <span>Saved Project Ideas ({savedProjects.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-mono text-violet-400">{p.domain} · {p.difficulty}</div>
                      <h4 className="text-sm font-semibold text-neutral-100">{p.title}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{p.objective}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onNavigate('projects', p.id)}
                        className="px-3 py-1 text-xs rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                      >
                        View Specs
                      </button>
                      <button
                        onClick={() => onToggleBookmark(p.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Tools */}
          {savedTools.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-semibold uppercase text-neutral-400 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>Saved Developer Tools ({savedTools.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedTools.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-mono text-emerald-400">{t.category} · {t.pricingModel}</div>
                      <h4 className="text-sm font-semibold text-neutral-100">{t.name}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{t.tagline}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={t.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-xs rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                      >
                        Visit
                      </a>
                      <button
                        onClick={() => onToggleBookmark(t.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
