# Kri Tech — Tech & Dev Resource Hub Architecture

## 1. Directory Structure (Next.js App Router & Full-Stack Specification)

```text
kri-tech/
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
│   │   │   ├── CodeBlock.tsx     # Syntax highlighting with 1-click copy & feedback
│   │   │   ├── ResourceCard.tsx  # Interactive card with unboxed metadata & upvote
│   │   │   └── ThemeToggle.tsx   # Dark/Light mode switcher
│   │   ├── roadmaps/
│   │   │   ├── RoadmapTree.tsx   # Interactive node sequence & status tracker
│   │   │   └── NodeDetailModal.tsx# Prerequisites, docs & video resources
│   │   ├── cheatsheets/
│   │   │   ├── CheatSheetViewer.tsx
│   │   │   └── TechFilterBar.tsx
│   │   ├── projects/
│   │   │   ├── ProjectGenerator.tsx # Interactive custom project synthesizer
│   │   │   └── ProjectDetailDrawer.tsx
│   │   └── tools/
│   │       ├── ToolCard.tsx
│   │       └── SubmitToolModal.tsx
│   ├── data/                     # Rich curated initial data sets
│   │   ├── roadmapsData.ts
│   │   ├── cheatsheetsData.ts
│   │   ├── projectsData.ts
│   │   └── toolsData.ts
│   ├── lib/
│   │   ├── prisma.ts             # Prisma ORM client instance
│   │   ├── fuseSearch.ts         # Client-side fuzzy search indexing
│   │   └── store.ts              # Persistent user progress & upvote store
│   └── types/
│       └── index.ts              # Strict TypeScript definitions
```

## 2. Core API Endpoints

- `GET /api/resources`: Fetch curated resources with category, tags, and pagination filter.
- `POST /api/upvotes`: Toggle user upvote for a resource; recalculates score atomically.
- `GET /api/roadmaps/:slug`: Fetch complete roadmap tree with nested nodes and prerequisites.
- `POST /api/roadmaps/nodes/:nodeId/status`: Update node status (`TO_LEARN`, `IN_PROGRESS`, `MASTERED`).
- `GET /api/cheatsheets`: Searchable syntax vault filtered by technology or language.
- `GET /api/projects`: Query portfolio ideas filtered by difficulty (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`).
- `POST /api/projects/generate`: Synthesize tailored project recommendations given a target tech stack.
