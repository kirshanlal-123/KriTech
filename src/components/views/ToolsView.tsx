import React, { useState } from 'react';
import { Wrench, ThumbsUp, Bookmark, ExternalLink, GitBranch, Plus, Search, Check, X } from 'lucide-react';
import { DevTool } from '../../types';
import { TOOLS_DATA } from '../../data/toolsData';

interface ToolsViewProps {
  customTools: DevTool[];
  upvotedIds: string[];
  bookmarkedIds: string[];
  onToggleUpvote: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onAddCustomTool: (tool: DevTool) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  customTools,
  upvotedIds,
  bookmarkedIds,
  onToggleUpvote,
  onToggleBookmark,
  onAddCustomTool,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Submit tool form state
  const [toolName, setToolName] = useState('');
  const [toolTagline, setToolTagline] = useState('');
  const [toolCategory, setToolCategory] = useState<DevTool['category']>('AI Coding');
  const [toolPricing, setToolPricing] = useState<DevTool['pricingModel']>('Open Source');
  const [toolWebsite, setToolWebsite] = useState('');
  const [toolRepo, setToolRepo] = useState('');
  const [toolTags, setToolTags] = useState('');

  const allTools = [...TOOLS_DATA, ...customTools];

  const categories = [
    'All',
    'AI Coding',
    'API & Backend',
    'Frontend & UI',
    'DevOps & Cloud',
    'Database',
    'Security & Testing',
  ];

  // Extract all unique tags
  const allTags = [
    'All',
    ...Array.from(new Set(allTools.flatMap((t) => t.tags))),
  ].slice(0, 16);

  const filteredTools = allTools.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesTag = selectedTag === 'All' || t.tags.includes(selectedTag);
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesTag && matchesSearch;
  });

  const handleSubmitTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !toolWebsite.trim()) return;

    const newTool: DevTool = {
      id: `custom-tool-${Date.now()}`,
      name: toolName.trim(),
      tagline: toolTagline.trim() || 'Modern developer tool submitted by community.',
      category: toolCategory,
      pricingModel: toolPricing,
      websiteUrl: toolWebsite.startsWith('http') ? toolWebsite : `https://${toolWebsite}`,
      repoUrl: toolRepo ? (toolRepo.startsWith('http') ? toolRepo : `https://${toolRepo}`) : undefined,
      tags: toolTags
        ? toolTags.split(',').map((t) => t.trim().toLowerCase())
        : ['developer-tool'],
      upvotes: 1,
      isTrending: true,
    };

    onAddCustomTool(newTool);
    setIsSubmitModalOpen(false);
    // Reset form
    setToolName('');
    setToolTagline('');
    setToolWebsite('');
    setToolRepo('');
    setToolTags('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header with Submit CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-emerald-400" />
            <span>Developer Tool Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Curated modern developer utilities, AI coding assistants, cloud runtimes, and open-source packages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Tool</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search input + Category tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-neutral-800 text-emerald-400 shadow-sm border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools & tags..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-mono text-neutral-400 mr-1">Filter Tag:</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2 py-0.5 text-xs rounded font-mono transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const isUpvoted = upvotedIds.includes(tool.id);
          const isBookmarked = bookmarkedIds.includes(tool.id);

          return (
            <div
              key={tool.id}
              className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-100">{tool.name}</span>
                    {tool.isTrending && (
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40">
                        Trending
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">{tool.pricingModel}</span>
                </div>

                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {tool.tagline}
                </p>

                {/* Unboxed Metadata Line */}
                <div className="flex items-center gap-1.5 mt-3 text-[11px] text-neutral-400 font-mono">
                  <span>{tool.category}</span>
                  {tool.tags.slice(0, 3).map((tag, idx) => (
                    <React.Fragment key={idx}>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-400">{tag}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Actions & Upvote */}
              <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <button
                  onClick={() => onToggleUpvote(tool.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    isUpvoted
                      ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-800/60 font-semibold'
                      : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300'
                  }`}
                  title={isUpvoted ? 'Remove upvote' : 'Upvote tool'}
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
                    title={isBookmarked ? 'Saved' : 'Bookmark tool'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  {tool.repoUrl && (
                    <a
                      href={tool.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-neutral-400 hover:text-neutral-200 transition-colors"
                      title="GitHub Repository"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-neutral-400 hover:text-emerald-400 transition-colors"
                    title="Visit Official Website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Tool Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-neutral-100 text-base">Submit Developer Tool</h3>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTool} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-neutral-400 mb-1">Tool Name *</label>
                <input
                  type="text"
                  required
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="e.g. Astro, Turborepo, Postman"
                  className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">Tagline / Short Pitch *</label>
                <input
                  type="text"
                  required
                  value={toolTagline}
                  onChange={(e) => setToolTagline(e.target.value)}
                  placeholder="1-line summary of what it solves"
                  className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-neutral-400 mb-1">Category</label>
                  <select
                    value={toolCategory}
                    onChange={(e) => setToolCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="AI Coding">AI Coding</option>
                    <option value="API & Backend">API & Backend</option>
                    <option value="Frontend & UI">Frontend & UI</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Database">Database</option>
                    <option value="Security & Testing">Security & Testing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-neutral-400 mb-1">Pricing Model</label>
                  <select
                    value={toolPricing}
                    onChange={(e) => setToolPricing(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Open Source">Open Source</option>
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">Website URL *</label>
                <input
                  type="url"
                  required
                  value={toolWebsite}
                  onChange={(e) => setToolWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">Repository URL (Optional)</label>
                <input
                  type="url"
                  value={toolRepo}
                  onChange={(e) => setToolRepo(e.target.value)}
                  placeholder="https://github.com/org/repo"
                  className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={toolTags}
                  onChange={(e) => setToolTags(e.target.value)}
                  placeholder="cli, rust, web, serverless"
                  className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                >
                  Submit to Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
