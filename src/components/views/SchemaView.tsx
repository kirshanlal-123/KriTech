import React, { useState } from 'react';
import { Database, FileText, Server, GitFork, Copy, Check, Layers } from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';

const PRISMA_SCHEMA_CODE = `// Kri Tech - Modern Tech & Dev Resource Hub
// Database Schema with Prisma ORM
// Configured for PostgreSQL / MySQL

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  STUDENT
  CONTRIBUTOR
  ADMIN
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum NodeStatus {
  TO_LEARN
  IN_PROGRESS
  MASTERED
}

enum ResourceType {
  ROADMAP
  CHEATSHEET
  PROJECT
  TOOL
}

model User {
  id            String             @id @default(cuid())
  email         String             @unique
  username      String             @unique
  name          String?
  avatarUrl     String?
  role          Role               @default(USER)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt

  upvotes       Upvote[]
  bookmarks     Bookmark[]
  nodeProgress  UserNodeProgress[]
  createdIdeas  ProjectIdea[]      @relation("UserProjects")
  createdTools  ToolSubmission[]

  @@index([email])
}

model Resource {
  id            String         @id @default(cuid())
  title         String
  slug          String         @unique
  description   String
  type          ResourceType
  category      String
  tags          String[]
  url           String?
  upvotesCount  Int            @default(0)
  viewsCount    Int            @default(0)
  isFeatured    Boolean        @default(false)
  isTrending    Boolean        @default(false)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  upvotes       Upvote[]
  bookmarks     Bookmark[]
  roadmap       Roadmap?
  cheatSheet    CheatSheet?
  projectIdea   ProjectIdea?
  toolDetails   ToolDetails?

  @@index([type])
  @@index([category])
  @@index([isTrending, upvotesCount])
}

model Upvote {
  id          String    @id @default(cuid())
  userId      String
  resourceId  String
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  resource    Resource  @relation(fields: [resourceId], references: [id], onDelete: Cascade)

  @@unique([userId, resourceId])
  @@index([resourceId])
}

model Roadmap {
  id            String     @id @default(cuid())
  resourceId    String     @unique
  title         String
  slug          String     @unique
  description   String
  category      String
  estimatedHours Int       @default(80)
  difficulty    Difficulty @default(INTERMEDIATE)

  resource      Resource   @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  nodes         Node[]
}

model Node {
  id              String             @id @default(cuid())
  roadmapId       String
  title           String
  description     String
  orderIndex      Int
  categoryGroup   String
  docUrl          String?
  videoUrl        String?
  videoDuration   String?
  estimatedHours  Int                @default(5)
  prerequisites   String[]
  topics          String[]

  roadmap         Roadmap            @relation(fields: [roadmapId], references: [id], onDelete: Cascade)
  userProgress    UserNodeProgress[]

  @@index([roadmapId, orderIndex])
}

model CheatSheet {
  id            String     @id @default(cuid())
  resourceId    String     @unique
  title         String
  technology    String
  category      String
  summary       String
  codeSnippets  Json
  officialDocsUrl String?

  resource      Resource   @relation(fields: [resourceId], references: [id], onDelete: Cascade)
}

model ProjectIdea {
  id              String      @id @default(cuid())
  resourceId      String      @unique
  authorId        String?
  title           String
  difficulty      Difficulty  @default(INTERMEDIATE)
  domain          String
  objective       String
  techStack       String[]
  features        String[]
  architecture    String
  suggestedApis   String[]
  estimatedWeeks  Int         @default(3)

  resource        Resource    @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  author          User?       @relation("UserProjects", fields: [authorId], references: [id], onDelete: SetNull)
}`;

const DIRECTORY_TREE = `kri-tech/
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema with User, Resource, Roadmap, etc.
│   └── seed.ts                   # Comprehensive database seed script
├── src/
│   ├── app/                      # Next.js App Router endpoints & layouts
│   │   ├── layout.tsx            # Root layout with ThemeProvider, Font injection
│   │   ├── page.tsx              # Homepage: Hero, Featured Modules, Trending Resources
│   │   ├── roadmaps/
│   │   │   ├── page.tsx          # Career & Skill paths index
│   │   │   └── [slug]/page.tsx   # Interactive path tree with status tracker
│   │   ├── cheatsheets/
│   │   │   ├── page.tsx          # Filterable cheat sheet vault & code viewer
│   │   │   └── [tech]/page.tsx   # Deep-dive technology cheat sheet
│   │   ├── projects/
│   │   │   ├── page.tsx          # Project generator & portfolio ideas gallery
│   │   │   └── [id]/page.tsx     # Project architectural specs & API guides
│   │   ├── tools/
│   │   │   └── page.tsx          # Developer tool directory & live upvoting
│   │   └── api/                  # RESTful API endpoints
│   │       ├── resources/route.ts
│   │       ├── roadmaps/[id]/nodes/route.ts
│   │       ├── cheatsheets/route.ts
│   │       ├── projects/route.ts
│   │       ├── upvotes/route.ts
│   │       └── search/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Top Bar Contract with navigation & actions
│   │   │   ├── Sidebar.tsx       # Responsive collapsible navigation
│   │   │   └── Footer.tsx        # Clean developer footer
│   │   ├── common/
│   │   │   ├── SearchBar.tsx     # Debounced input with keyboard shortcuts
│   │   │   ├── CommandPalette.tsx# Cmd+K global fuzzy search modal
│   │   │   └── CodeBlock.tsx     # Syntax highlighting with 1-click copy & feedback
│   ├── lib/
│   │   ├── prisma.ts             # Prisma ORM client instance
│   │   ├── fuseSearch.ts         # Client-side fuzzy search indexing
│   │   └── store.ts              # Persistent user progress & upvote store
│   └── types/
│       └── index.ts              # Strict TypeScript definitions`;

export const SchemaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'directory' | 'apis'>('schema');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <Database className="w-7 h-7 text-cyan-400" />
            <span>Schema & Architecture Specifications</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Production Prisma ORM models, Next.js App Router tree, and RESTful API endpoints.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-neutral-800 text-cyan-400 border border-neutral-700/60'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Prisma Schema
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-neutral-800 text-cyan-400 border border-neutral-700/60'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Directory Layout
          </button>
          <button
            onClick={() => setActiveTab('apis')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'apis'
                ? 'bg-neutral-800 text-cyan-400 border border-neutral-700/60'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            RESTful Endpoints
          </button>
        </div>
      </div>

      {/* Tab: Prisma Schema */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-200">
              Relational Models Overview (PostgreSQL / MySQL)
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Supports User authentication, polymorphic Resources, Roadmaps with sequenced prerequisite Nodes, CheatSheets with JSONB snippets, ProjectIdeas with architecture blueprints, and Upvotes with composite uniqueness.
            </p>
          </div>

          <CodeBlock
            code={PRISMA_SCHEMA_CODE}
            language="prisma"
            title="prisma/schema.prisma"
            showLineNumbers={true}
          />
        </div>
      )}

      {/* Tab: Next.js Directory Layout */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-200">
              Next.js App Router Architecture
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Clean modular structure separating App Router pages, reusable components, persistent stores, and client-side Fuse.js index.
            </p>
          </div>

          <CodeBlock
            code={DIRECTORY_TREE}
            language="text"
            title="Next.js App Router Directory Hierarchy"
            showLineNumbers={false}
          />
        </div>
      )}

      {/* Tab: API Endpoints */}
      {activeTab === 'apis' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 mb-2">
            <h3 className="text-sm font-semibold text-neutral-200">
              RESTful API Routing Specifications
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Standardized endpoints handling resource queries, upvoting concurrency, and learning node status sync.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">GET</span>
                <span className="text-neutral-200">/api/resources</span>
              </div>
              <p className="text-neutral-400 font-sans text-xs">
                Query resources with optional query params: <code className="text-cyan-300">?type=ROADMAP&category=Web&page=1&limit=20</code>. Returns paginated JSON payload with metadata.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-bold">POST</span>
                <span className="text-neutral-200">/api/upvotes</span>
              </div>
              <p className="text-neutral-400 font-sans text-xs">
                Toggles upvote for authenticated user: <code className="text-cyan-300">&#123; resourceId: string &#125;</code>. Uses database transactions to maintain atomic counter sync.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold">PUT</span>
                <span className="text-neutral-200">/api/roadmaps/nodes/:nodeId/status</span>
              </div>
              <p className="text-neutral-400 font-sans text-xs">
                Updates personal learning status: <code className="text-cyan-300">&#123; status: &quot;TO_LEARN&quot; | &quot;IN_PROGRESS&quot; | &quot;MASTERED&quot; &#125;</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">GET</span>
                <span className="text-neutral-200">/api/cheatsheets?tech=python</span>
              </div>
              <p className="text-neutral-400 font-sans text-xs">
                Fetches deep-dive code snippets and explanations for a given programming language or tool.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
