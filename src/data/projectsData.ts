import { ProjectIdea } from '../types';

export const PROJECTS_DATA: ProjectIdea[] = [
  {
    id: 'proj-01',
    title: 'Distributed Key-Value Store with Raft Consensus',
    difficulty: 'Advanced',
    domain: 'Systems',
    objective: 'Build an in-memory, fault-tolerant key-value database that maintains consistency across replicated cluster nodes using the Raft consensus protocol.',
    techStack: ['Go / Rust', 'gRPC', 'Protocol Buffers', 'BadgerDB / RocksDB', 'Docker'],
    features: [
      'Leader election with randomized heartbeat timers to prevent split-brain',
      'Log replication and commit quorum calculation across 3–5 cluster nodes',
      'Snapshotting and log compaction to prevent unbounded memory growth',
      'gRPC client SDK supporting key get, put, delete, and CAS (Compare-And-Swap) operations',
      'Fault-injection test suite simulating network partitions and node drops',
    ],
    architecture: `Client Request ──> gRPC API Layer ──> Raft Consensus Engine (Leader)
                                            ├── Replicate AppendEntries to Followers
                                            ├── Quorum Write Check (N/2 + 1)
                                            └── Commit to Persistent WAL (RocksDB/BadgerDB)`,
    suggestedApis: ['gRPC Reflection API', 'Prometheus Metrics Exporter', 'Go standard library (net/rpc)'],
    estimatedWeeks: 4,
    githubStarter: 'https://github.com/topics/raft-consensus',
    upvotes: 342,
  },
  {
    id: 'proj-02',
    title: 'Real-Time Collaborative Code Canvas & Terminal',
    difficulty: 'Advanced',
    domain: 'Full-Stack',
    objective: 'Create a browser-based collaborative pair-programming environment with zero-latency multi-cursor sync, shared execution terminal, and audio channels.',
    techStack: ['Next.js / React', 'TypeScript', 'WebSockets', 'Yjs (CRDT)', 'Monaco Editor', 'Node-PTY / Docker'],
    features: [
      'Conflict-free Replicated Data Types (CRDTs) with Yjs for concurrent non-blocking edits',
      'Shared terminal sessions executing sandboxed shell commands in ephemeral Docker containers',
      'Live cursor presence with user avatars and selected text highlight broadcasting',
      'Snapshot version history with one-click rollback and git branch export',
      'Role-based permissions (Viewer, Editor, Terminal Operator)',
    ],
    architecture: `Browser Client (Monaco + Yjs) <──WebSocket──> Node.js WS Gateway (y-websocket)
                                                  ├── Redis Pub/Sub Cluster
                                                  └── Docker Sandbox Worker (node-pty exec)`,
    suggestedApis: ['Y-Websocket Server', 'WebRTC Data Channels', 'Judge0 Code Execution API'],
    estimatedWeeks: 5,
    githubStarter: 'https://github.com/yjs/yjs',
    upvotes: 289,
  },
  {
    id: 'proj-03',
    title: 'High-Throughput Reverse Proxy & Rate Limiter',
    difficulty: 'Intermediate',
    domain: 'Systems',
    objective: 'Design an asynchronous reverse proxy capable of routing 50,000 req/sec with token bucket rate limiting and dynamic upstream health checking.',
    techStack: ['Go or Rust', 'Tokio / Hyper', 'Redis', 'Docker Compose', 'Vegeta Load Tester'],
    features: [
      'Sliding window and token bucket algorithms implemented via Redis Lua scripts',
      'Dynamic upstream server registration and periodic active HTTP health checks',
      'Configurable path rewriting, header manipulation, and circuit breaker states',
      'Structured JSON access logging with request duration percentiles (p50, p95, p99)',
      'Graceful shutdown handling without dropping in-flight connections',
    ],
    architecture: `Inbound HTTP Requests ──> Epoll Event Loop ──> Rate Limit Filter (Redis Lua)
                                                     ├── Healthy Upstream Pool (Round Robin)
                                                     └── OpenTelemetry Prometheus Exporter`,
    suggestedApis: ['Redis Command API', 'OpenTelemetry Metrics', 'Cloudflare IP range lists'],
    estimatedWeeks: 3,
    githubStarter: 'https://github.com/topics/reverse-proxy',
    upvotes: 215,
  },
  {
    id: 'proj-04',
    title: 'AI-Powered Semantic Codebase Search Engine',
    difficulty: 'Advanced',
    domain: 'AI / ML',
    objective: 'Index GitHub repositories into an AST (Abstract Syntax Tree), generate dense embeddings for function blocks, and query code using natural language questions.',
    techStack: ['Python', 'FastAPI', 'Tree-sitter', 'PostgreSQL (pgvector)', 'Gemini Embeddings', 'React'],
    features: [
      'AST code parsing with Tree-sitter to chunk code semantically by function, class, and method',
      'Dense vector embeddings generated for docstrings and implementation bodies',
      'Hybrid search combining pgvector cosine distance and full-text BM25 search',
      'Interactive visual code inspector highlighting query-matching AST nodes',
      'Natural language answer synthesis citing file paths and line number ranges',
    ],
    architecture: `Git Repo / File Watcher ──> Tree-sitter AST Chunker ──> Gemini Embedding Model
                                                           └── pgvector Database (HNSW Index)
                                                                 ▲
User Query ──────────────────> Fast Hybrid Reranker ─────────────┘`,
    suggestedApis: ['Google Gemini API (text-embedding-004)', 'GitHub REST / GraphQL API', 'Tree-sitter Language Parsers'],
    estimatedWeeks: 4,
    githubStarter: 'https://github.com/tree-sitter/tree-sitter',
    upvotes: 310,
  },
  {
    id: 'proj-05',
    title: 'Full-Stack Developer Analytics & Git Visualizer',
    difficulty: 'Intermediate',
    domain: 'Full-Stack',
    objective: 'A telemetry dashboard that connects to GitHub/GitLab, analyzes commit cadence, PR review velocity, churn rate, and visualizes developer workstreams.',
    techStack: ['React / Vite', 'Tailwind CSS', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Recharts'],
    features: [
      'OAuth 2.0 connection to GitHub with personal access token fallback',
      'Interactive commit punchcard, PR lead-time distribution, and code churn heatmap',
      'Collaborative team boards comparing throughput metrics and review turnaround times',
      'Automated weekly productivity summary export in PDF and Markdown format',
      'Configurable privacy masks to anonymize sensitive repo and commit messages',
    ],
    architecture: `GitHub Webhooks / Polling ──> Next.js API Routes ──> Prisma Schema (PostgreSQL)
                                                      └── Aggregated Analytics Engine
                                                            └── React 19 Client Dashboard`,
    suggestedApis: ['GitHub GraphQL API v4', 'GitLab REST API', 'Shields.io Badges API'],
    estimatedWeeks: 2,
    githubStarter: 'https://github.com/octokit/octokit.js',
    upvotes: 198,
  },
  {
    id: 'proj-06',
    title: 'Terminal-Based Personal Knowledge & Task CLI',
    difficulty: 'Beginner',
    domain: 'Systems',
    objective: 'Build a lightning-fast keyboard-first terminal TUI application for tracking developer tasks, quick code snippets, and markdown scratchpads with local SQLite sync.',
    techStack: ['Rust (Ratatui) or Python (Textual)', 'SQLite', 'Ripgrep', 'Vim keybindings'],
    features: [
      'Interactive split-pane TUI layout with modal vim navigation (hjkl, /, :w)',
      'Full-text search across all notes with millisecond response time via SQLite FTS5',
      'Git automatic sync: commits and pushes scratchpad notes to a private GitHub repo',
      'Fuzzy tag filtering and markdown syntax colorization inside the terminal window',
      'Export tasks to Todo.txt standard format',
    ],
    architecture: `Terminal STDIN/STDOUT ──> TUI Render Loop (Ratatui/Textual)
                               ├── SQLite DB with FTS5 Full-Text Index
                               └── Background Git Sync Thread`,
    suggestedApis: ['SQLite3 Embedded C API', 'Ripgrep Binary Spawn', 'GitHub SSH Key Agent'],
    estimatedWeeks: 2,
    githubStarter: 'https://github.com/ratatui/ratatui',
    upvotes: 165,
  },
  {
    id: 'proj-07',
    title: 'Markdown Documentation Engine with Live Canvas Preview',
    difficulty: 'Beginner',
    domain: 'Full-Stack',
    objective: 'A responsive developer documentation builder with live markdown compilation, Mermaid diagram rendering, syntax-highlighted code blocks, and static export.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Unified / Remark / Rehype', 'Mermaid.js'],
    features: [
      'Zero-lag live markdown compiler running inside a dedicated Web Worker',
      'Automatic table-of-contents generation with active intersection observer tracking',
      'Mermaid graph rendering for architecture flowcharts and sequence diagrams',
      'One-click export to single-file self-contained HTML or zip package',
      'Search index built client-side with Fuse.js',
    ],
    architecture: `Editor Input ──> Web Worker (Remark/Rehype Pipeline) ──> DOM Sanitizer (DOMPurify)
                                                         └── Live Iframe Sandbox Preview`,
    suggestedApis: ['Mermaid JS Engine', 'Unified Ecosystem', 'File System Access API'],
    estimatedWeeks: 1,
    githubStarter: 'https://github.com/remarkjs/remark',
    upvotes: 142,
  },
  {
    id: 'proj-08',
    title: 'Microservices Event-Driven Notification Engine',
    difficulty: 'Intermediate',
    domain: 'DevOps & Cloud',
    objective: 'A centralized notification routing service that ingests transactional events from message queues and delivers them via Webhooks, Email, Discord, and Slack.',
    techStack: ['Node.js / Express', 'RabbitMQ / Kafka', 'Redis', 'Docker Compose', 'PostgreSQL'],
    features: [
      'Event ingestion queue with exponential backoff retry and Dead Letter Queue (DLQ)',
      'Template compilation with Handlebars for personalized multi-channel notifications',
      'Per-user notification preference matrix and rate limit quotas',
      'Webhook signature generation using HMAC-SHA256 for secure verification',
      'OpenTelemetry tracing through RabbitMQ exchange and delivery handlers',
    ],
    architecture: `Event Producers ──> RabbitMQ Exchange ──> Notification Consumer Service
                                              ├── Worker Queue (Email / Discord / Webhook)
                                              └── Redis Rate Limiting & DLQ Retry Buffer`,
    suggestedApis: ['Resend Email API', 'Discord Webhook API', 'Slack Incoming Webhooks'],
    estimatedWeeks: 3,
    githubStarter: 'https://github.com/topics/notification-service',
    upvotes: 184,
  },
];
