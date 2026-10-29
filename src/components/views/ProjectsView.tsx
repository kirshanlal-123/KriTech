import React, { useState, useRef } from 'react';
import { FolderGit2, Sparkles, Filter, Bookmark, ThumbsUp, X, Check, RefreshCw, GitBranch, Terminal } from 'lucide-react';
import { ProjectIdea, ViewMode } from '../../types';
import { PROJECTS_DATA } from '../../data/projectsData';
import { ReadingProgressBar } from '../common/ReadingProgressBar';

interface ProjectsViewProps {
  initialProjectId?: string;
  bookmarkedIds: string[];
  upvotedIds: string[];
  onToggleBookmark: (id: string) => void;
  onToggleUpvote: (id: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  initialProjectId,
  bookmarkedIds,
  upvotedIds,
  onToggleBookmark,
  onToggleUpvote,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<ProjectIdea | null>(
    initialProjectId ? PROJECTS_DATA.find((p) => p.id === initialProjectId) || null : null
  );
  const modalBodyRef = useRef<HTMLDivElement>(null);

  // Custom Generator state
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [genDifficulty, setGenDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [genDomain, setGenDomain] = useState<'Full-Stack' | 'Systems' | 'AI / ML' | 'DevOps & Cloud'>('Systems');
  const [customGeneratedProject, setCustomGeneratedProject] = useState<ProjectIdea | null>(null);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const domains = ['All', 'Full-Stack', 'Systems', 'AI / ML', 'DevOps & Cloud'];

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesDomain = selectedDomain === 'All' || p.domain === selectedDomain;
    return matchesDiff && matchesDomain;
  });

  const handleGenerateCustomIdea = () => {
    // Generate tailored high-impact project idea based on selections
    const seed = Date.now();
    let newProject: ProjectIdea;

    if (genDomain === 'Systems') {
      newProject = {
        id: `custom-sys-${seed}`,
        title: genDifficulty === 'Advanced'
          ? 'Distributed Write-Ahead Log (WAL) & LSM-Tree Engine'
          : genDifficulty === 'Intermediate'
          ? 'High-Performance DNS Resolver & Cache with TTL Pruning'
          : 'Custom Unix Shell with Pipe Chaining & Redirection',
        difficulty: genDifficulty,
        domain: 'Systems',
        objective: genDifficulty === 'Advanced'
          ? 'Build a high-throughput Log-Structured Merge-tree (LSM) storage engine with memtable flushing, SSTable compaction, and sparse bloom filter indexes.'
          : 'Implement a concurrent caching DNS resolver supporting recursive query lookups, DNS over HTTPS (DoH), and atomic TTL evictions.',
        techStack: ['Rust / C++', 'Tokio Async', 'POSIX Syscalls', 'Benchmark Suite'],
        features: [
          'Zero-copy memory buffers for packet serialization',
          'SSTable disk flushing with periodic level-tiered compaction',
          'Bloom filters reducing disk I/O on nonexistent key checks',
          'Comprehensive latency microbenchmarks against Redis / RocksDB',
        ],
        architecture: `Client Queries ──> Async I/O Event Loop (epoll/kqueue)
                        ├── In-Memory Memtable (SkipList)
                        └── Level 0..N SSTables (Disk Block Index)`,
        suggestedApis: ['Standard Linux epoll', 'Criterion.rs Benchmarking', 'DoH Cloudflare Endpoint'],
        estimatedWeeks: genDifficulty === 'Advanced' ? 5 : 3,
        upvotes: 42,
      };
    } else if (genDomain === 'AI / ML') {
      newProject = {
        id: `custom-ai-${seed}`,
        title: genDifficulty === 'Advanced'
          ? 'Autonomous Multi-Agent Workflow Engine with Tool Calling'
          : 'Vector Similarity Search & Multimodal Document Extractor',
        difficulty: genDifficulty,
        domain: 'AI / ML',
        objective: 'Architect a serverless multi-agent orchestrator that breaks complex developer tasks into parallel execution DAGs with human-in-the-loop approval gates.',
        techStack: ['Python 3.12', 'FastAPI', 'Gemini 2.5 Flash', 'pgvector', 'Docker'],
        features: [
          'Dynamic tool execution runtime with Docker container isolation',
          'Vector memory persistence using hybrid dense/sparse embeddings',
          'WebSocket streaming agent thought-process and intermediate scratchpads',
          'Fallback circuit breakers to handle API rate limits and hallucination loops',
        ],
        architecture: `User Intent ──> Agent Supervisor (Planner)
                      ├── Specialized Worker Agents (Coder, Reviewer, Tester)
                      └── Shared Vector Memory (pgvector + Gemini)`,
        suggestedApis: ['Google Gemini API', 'Docker Engine API', 'GitHub Webhooks'],
        estimatedWeeks: 4,
        upvotes: 68,
      };
    } else {
      newProject = {
        id: `custom-fs-${seed}`,
        title: genDifficulty === 'Advanced'
          ? 'Multi-Tenant SaaS Starter with Row-Level Security & Webhooks'
          : 'Developer Snippet Hub with Automated Test Runner',
        difficulty: genDifficulty,
        domain: 'Full-Stack',
        objective: 'Construct a multi-tenant platform with automated workspace provisioning, organization RBAC, and cryptographically verified webhook delivery.',
        techStack: ['Next.js 15 / React 19', 'PostgreSQL (RLS)', 'Prisma ORM', 'Redis', 'Tailwind CSS'],
        features: [
          'PostgreSQL Row-Level Security (RLS) guaranteeing strict tenant boundary isolation',
          'Stripe customer portal billing integration with automatic tier entitlement checks',
          'HMAC-SHA256 signed outbound webhooks with exponential backoff retry worker',
          'Granular team permission roles (Owner, Engineer, Billing Admin, Auditor)',
        ],
        architecture: `Next.js App Router ──> Prisma ORM (Tenant Scoped Client)
                             ├── PostgreSQL (Row Level Security Enabled)
                             └── Redis Queue (BullMQ for Webhook Retries)`,
        suggestedApis: ['Stripe Billing API', 'Resend Email API', 'GitHub OAuth'],
        estimatedWeeks: 3,
        upvotes: 55,
      };
    }

    setCustomGeneratedProject(newProject);
    setActiveProject(newProject);
    setShowGeneratorModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header with Project Synthesizer CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-violet-400" />
            <span>Open-Source & Portfolio Project Generator</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Engineered project blueprints featuring objectives, architecture diagrams, key technical milestones, and APIs.
          </p>
        </div>

        {/* Generate Custom Idea Trigger */}
        <button
          onClick={() => setShowGeneratorModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/30 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Synthesize Custom Blueprint</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="space-y-3">
        {/* Difficulty Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 text-xs rounded-md font-mono transition-colors cursor-pointer ${
                selectedDifficulty === diff
                  ? 'bg-violet-950/90 text-violet-300 border border-violet-800/60 font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Domain Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-neutral-400">Domain:</span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-neutral-800 text-cyan-400 font-medium border border-neutral-700/80'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Generated Banner if exists */}
      {customGeneratedProject && (
        <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-800/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
            <div>
              <div className="text-xs font-mono text-violet-300">Recently Synthesized Blueprint:</div>
              <div className="text-sm font-bold text-neutral-100">{customGeneratedProject.title}</div>
            </div>
          </div>
          <button
            onClick={() => setActiveProject(customGeneratedProject)}
            className="px-3 py-1.5 rounded-lg bg-violet-800/80 hover:bg-violet-700 text-xs text-white transition-colors cursor-pointer shrink-0"
          >
            Open Specs
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const isBookmarked = bookmarkedIds.includes(project.id);
          const isUpvoted = upvotedIds.includes(project.id);

          return (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-violet-500/40 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                  <span>{project.domain}</span>
                  <span
                    className={`font-semibold ${
                      project.difficulty === 'Advanced'
                        ? 'text-red-400'
                        : project.difficulty === 'Intermediate'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {project.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-100 group-hover:text-violet-300 transition-colors leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                  {project.objective}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleUpvote(project.id);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer ${
                    isUpvoted
                      ? 'bg-violet-950/80 text-violet-300 border border-violet-800/60'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
                  <span className="font-mono tabular-nums">{project.upvotes + (isUpvoted ? 1 : 0)}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-mono text-[11px]">
                    ~{project.estimatedWeeks}w
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(project.id);
                    }}
                    className={`p-1.5 rounded hover:bg-neutral-800 transition-colors cursor-pointer ${
                      isBookmarked ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Detail Modal / Blueprint Viewer */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-800 flex items-start justify-between gap-4 bg-neutral-950/80">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
                  <span>{activeProject.domain}</span>
                  <span>·</span>
                  <span className="text-violet-400 font-semibold">{activeProject.difficulty}</span>
                  <span>·</span>
                  <span>{activeProject.estimatedWeeks} Weeks Timeline</span>
                </div>
                <h2 className="text-xl font-bold text-neutral-100">{activeProject.title}</h2>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reading progress bar for documentation */}
            <ReadingProgressBar
              targetRef={modalBodyRef}
              colorScheme="violet"
              showPercentageBadge={true}
            />

            {/* Modal Body */}
            <div ref={modalBodyRef} className="p-6 overflow-y-auto space-y-6 text-sm">
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-neutral-400 mb-1.5">
                  1. Project Objective & Vision
                </h4>
                <p className="text-neutral-300 leading-relaxed text-sm">
                  {activeProject.objective}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-neutral-400 mb-2">
                  2. Recommended Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-200 font-mono text-xs border border-neutral-700/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-neutral-400 mb-2">
                  3. Key Features to Implement
                </h4>
                <ul className="space-y-2">
                  {activeProject.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-neutral-400 mb-2">
                  4. System Architecture Overview
                </h4>
                <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  <pre>{activeProject.architecture}</pre>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-neutral-400 mb-2">
                  5. Suggested APIs & External Data Sources
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.suggestedApis.map((api, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-neutral-950 text-neutral-300 font-mono text-xs border border-neutral-800"
                    >
                      {api}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/90 flex items-center justify-between">
              <div className="text-xs font-mono text-neutral-400">
                Ready to build in your preferred IDE
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleBookmark(activeProject.id)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                >
                  {bookmarkedIds.includes(activeProject.id) ? 'Saved in Hub ✓' : 'Save to My Hub'}
                </button>
                <button
                  onClick={() => setActiveProject(null)}
                  className="px-4 py-1.5 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Synthesizer Custom Generator Dialog */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h3 className="font-bold text-neutral-100 text-base">Synthesize Custom Project</h3>
              </div>
              <button
                onClick={() => setShowGeneratorModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  Target Domain
                </label>
                <select
                  value={genDomain}
                  onChange={(e) => setGenDomain(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-violet-500"
                >
                  <option value="Systems">Systems & Distributed Engines</option>
                  <option value="AI / ML">AI / ML & Vector Pipelines</option>
                  <option value="Full-Stack">Full-Stack SaaS & APIs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs focus:outline-none focus:border-violet-500"
                >
                  <option value="Beginner">Beginner (Foundations & CLI)</option>
                  <option value="Intermediate">Intermediate (Real-time & Caching)</option>
                  <option value="Advanced">Advanced (High-scale & Consensus)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGeneratorModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateCustomIdea}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Blueprint</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
