import React, { useState } from 'react';
import { Compass, FileCode, FolderGit2, Wrench, ArrowRight, ThumbsUp, Bookmark, ExternalLink, Terminal, Sparkles, Check, Copy } from 'lucide-react';
import { ViewMode, DevTool, CheatSheet, ProjectIdea } from '../../types';
import { SearchBar } from '../common/SearchBar';
import { searchAllResources } from '../../lib/fuseSearch';

interface HomeViewProps {
  onNavigate: (view: ViewMode, targetId?: string) => void;
  onOpenCommandPalette: () => void;
  trendingTools: DevTool[];
  featuredCheatSheets: CheatSheet[];
  featuredProjects: ProjectIdea[];
  upvotedIds: string[];
  bookmarkedIds: string[];
  onToggleUpvote: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenCommandPalette,
  trendingTools,
  featuredCheatSheets,
  featuredProjects,
  upvotedIds,
  bookmarkedIds,
  onToggleUpvote,
  onToggleBookmark,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const searchResults = heroSearch.trim() ? searchAllResources(heroSearch, 4) : [];

  const handleCopyCode = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSnippetId(id);
      setTimeout(() => setCopiedSnippetId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer Resource Nexus for Engineers & CS Students</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-100 text-balance leading-tight">
            Level up your engineering with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">curated dev intelligence</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Navigate interactive career roadmaps, copy battle-tested syntax cheat sheets, generate resume-ready portfolio architectures, and discover community-vetted developer tools.
          </p>

          {/* Dynamic Search Bar */}
          <div className="max-w-xl mx-auto pt-2">
            <SearchBar
              value={heroSearch}
              onChange={setHeroSearch}
              placeholder="Search across roadmaps, cheat sheets, projects, and tools..."
              onFocus={() => {}}
            />

            {/* Quick dropdown when user types in Hero search */}
            {searchResults.length > 0 && (
              <div className="mt-2 text-left bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden divide-y divide-neutral-800/60 animate-in fade-in duration-100">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(item.targetView, item.targetId)}
                    className="p-3 hover:bg-neutral-800/80 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-neutral-200">{item.title}</div>
                      <div className="text-xs text-neutral-400 line-clamp-1">{item.description}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 ml-3" />
                  </div>
                ))}
                <button
                  onClick={onOpenCommandPalette}
                  className="w-full text-center py-2 text-xs text-cyan-400 font-mono hover:bg-neutral-800/40 transition-colors"
                >
                  View all matching results in Command Palette (⌘K) →
                </button>
              </div>
            )}

            {/* Quick-Filter Segmented Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-neutral-500 font-mono">Quick filters:</span>
              <button
                onClick={() => onNavigate('roadmaps')}
                className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              >
                Career Roadmaps
              </button>
              <button
                onClick={() => onNavigate('cheatsheets')}
                className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              >
                Cheat Sheet Vault
              </button>
              <button
                onClick={() => onNavigate('projects')}
                className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              >
                Project Ideas
              </button>
              <button
                onClick={() => onNavigate('tools')}
                className="px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-colors cursor-pointer"
              >
                Tool Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Modules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-100 tracking-tight">Core Modules</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Explore the primary engineering resource vaults</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Roadmaps */}
          <div
            onClick={() => onNavigate('roadmaps')}
            className="group p-5 rounded-xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-950/70 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-100 group-hover:text-cyan-400 transition-colors">
                Interactive Roadmaps
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Step-by-step career and skill paths covering Full-Stack, System Design, Backend, and AI/ML with live progress tracking.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>5 Curated Tracks</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Card 2: Cheat Sheets */}
          <div
            onClick={() => onNavigate('cheatsheets')}
            className="group p-5 rounded-xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-950/70 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-100 group-hover:text-amber-400 transition-colors">
                Cheat Sheet Vault
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Zero-fluff syntax cheat sheets for Python, TypeScript, Modern C, Java 21, PostgreSQL, Docker, and Git with 1-click copy.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>8 Tech Stacks</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Card 3: Project Generator */}
          <div
            onClick={() => onNavigate('projects')}
            className="group p-5 rounded-xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-violet-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-violet-950/70 border border-violet-800/40 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-105 transition-transform">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-100 group-hover:text-violet-400 transition-colors">
                Project Generator
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Portfolio project architectures with technical objectives, feature requirements, data flow diagrams, and starter APIs.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>8 Blueprints</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Card 4: Tools Directory */}
          <div
            onClick={() => onNavigate('tools')}
            className="group p-5 rounded-xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-950/70 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-100 group-hover:text-emerald-400 transition-colors">
                Developer Tool Directory
              </h3>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Community-upvoted utilities, AI coding assistants, open-source API clients, and cloud edge runtimes.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 font-mono">
              <span>12+ Verified Tools</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

        </div>
      </section>

      {/* Trending Resources Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-100 tracking-tight">Trending Developer Tools</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Most upvoted utilities this week by developers</p>
          </div>
          <button
            onClick={() => onNavigate('tools')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Explore all tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingTools.slice(0, 3).map((tool) => {
            const isUpvoted = upvotedIds.includes(tool.id);
            const isBookmarked = bookmarkedIds.includes(tool.id);

            return (
              <div
                key={tool.id}
                className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm text-neutral-100">{tool.name}</span>
                    <span className="text-[11px] font-mono text-neutral-400">{tool.pricingModel}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {tool.tagline}
                  </p>
                  
                  {/* Unboxed metadata tags */}
                  <div className="flex items-center gap-1.5 mt-3 text-[11px] text-neutral-400">
                    <span>{tool.category}</span>
                    {tool.tags.slice(0, 2).map((t, idx) => (
                      <React.Fragment key={idx}>
                        <span aria-hidden="true">·</span>
                        <span className="text-neutral-400">{t}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onToggleUpvote(tool.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      isUpvoted
                        ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-700/60'
                        : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
                    <span className="font-mono tabular-nums font-medium">
                      {tool.upvotes + (isUpvoted ? 1 : 0)}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleBookmark(tool.id)}
                      className={`p-1.5 rounded hover:bg-neutral-800 transition-colors cursor-pointer ${
                        isBookmarked ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark tool'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-400 hover:text-cyan-400 transition-colors"
                      title="Open tool website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Cheat Sheet Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-100 tracking-tight">Essential Syntax Highlights</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Quickly copy battle-tested syntax snippets</p>
          </div>
          <button
            onClick={() => onNavigate('cheatsheets')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View all 8 cheat sheets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {featuredCheatSheets.slice(0, 2).map((cs) => {
            const snippet = cs.snippets[0];
            const isCopied = copiedSnippetId === snippet.id;

            return (
              <div
                key={cs.id}
                className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="font-semibold text-neutral-200">{cs.technology}</span>
                      <span>·</span>
                      <span>{snippet.title}</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(snippet.id, snippet.code)}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 rounded cursor-pointer transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-[11px] text-emerald-400 font-mono">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[11px] font-mono">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-neutral-950 font-mono text-xs text-neutral-200 overflow-x-auto leading-relaxed border border-neutral-800/80">
                    <code>{snippet.code.slice(0, 260)}...</code>
                  </pre>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
                  <p className="line-clamp-1 pr-2">{snippet.explanation}</p>
                  <button
                    onClick={() => onNavigate('cheatsheets', cs.id)}
                    className="text-cyan-400 hover:text-cyan-300 whitespace-nowrap cursor-pointer"
                  >
                    Open Sheet →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Architecture Blueprints */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-100 tracking-tight">Portfolio & System Blueprints</h2>
            <p className="text-xs text-neutral-400 mt-0.5">High-impact project ideas for portfolios and resume building</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Generate custom projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredProjects.slice(0, 2).map((proj) => (
            <div
              key={proj.id}
              onClick={() => onNavigate('projects', proj.id)}
              className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5 font-mono">
                  <span>{proj.domain}</span>
                  <span className="text-cyan-400">{proj.difficulty}</span>
                </div>
                <h3 className="font-semibold text-neutral-100 text-sm">{proj.title}</h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                  {proj.objective}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] text-neutral-400">
                  {proj.techStack.map((tech, idx) => (
                    <span key={idx} className="font-mono bg-neutral-800/80 px-1.5 py-0.5 rounded text-neutral-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <span className="font-mono">{proj.estimatedWeeks} weeks estimated</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  View Architecture Blueprint →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
