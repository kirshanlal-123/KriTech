import { CheatSheet } from '../types';

export const CHEATSHEETS_DATA: CheatSheet[] = [
  {
    id: 'python-cheatsheet',
    title: 'Python 3.12+ Modern Reference',
    technology: 'Python',
    category: 'Languages',
    summary: 'High-frequency idioms including structural pattern matching, walrus expressions, async context managers, and type unions.',
    iconName: 'FileCode',
    officialDocsUrl: 'https://docs.python.org/3/',
    snippets: [
      {
        id: 'py-01',
        title: 'Structural Pattern Matching (match / case)',
        language: 'python',
        code: `def process_event(event: dict) -> str:
    match event:
        case {"type": "click", "coords": (x, y)} if x > 0:
            return f"Positive click at ({x}, {y})"
        case {"type": "keypress", "key": str(key)}:
            return f"Key pressed: {key}"
        case {"type": "error", "code": int(c), **rest}:
            return f"Error {c}: {rest.get('msg', 'Unknown')}"
        case _:
            return "Unhandled event"`,
        explanation: 'Available since Python 3.10+, allows expressive destructuring of dictionaries, tuples, and custom dataclasses with guard clauses.',
        tags: ['pattern-matching', 'control-flow'],
      },
      {
        id: 'py-02',
        title: 'Asynchronous Task Groups (Python 3.11+)',
        language: 'python',
        code: `import asyncio

async def fetch_api(endpoint: str) -> dict:
    await asyncio.sleep(0.1)
    return {"endpoint": endpoint, "status": 200}

async def main():
    # TaskGroup guarantees clean cancellation and propagation of exceptions
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(fetch_api("/users"))
        t2 = tg.create_task(fetch_api("/metrics"))
        t3 = tg.create_task(fetch_api("/health"))

    results = [t1.result(), t2.result(), t3.result()]
    print(f"Fetched {len(results)} services")

asyncio.run(main())`,
        explanation: 'Replaces messy asyncio.gather with structured concurrency that cancels sibling tasks automatically if one raises an unhandled exception.',
        tags: ['asyncio', 'concurrency'],
      },
      {
        id: 'py-03',
        title: 'Walrus Operator & List Comprehension Filtering',
        language: 'python',
        code: `# Assignment expression := computes expensive calculation once in filter
raw_data = [" 12 ", "bad", "45.8", " 99 ", "invalid"]

def parse_num(val: str) -> float | None:
    try:
        return float(val.strip())
    except ValueError:
        return None

# Only keep valid numbers without calling parse_num twice
valid_numbers = [num for item in raw_data if (num := parse_num(item)) is not None]
# Result: [12.0, 45.8, 99.0]`,
        explanation: 'The walrus operator := binds a value to a variable within an expression to avoid redundant function calls.',
        tags: ['walrus', 'performance'],
      },
    ],
  },
  {
    id: 'typescript-cheatsheet',
    title: 'TypeScript & Modern JavaScript',
    technology: 'TypeScript',
    category: 'Languages',
    summary: 'Discriminated unions, satisfies operator, mapped & conditional types, and generic constraint patterns.',
    iconName: 'Code',
    officialDocsUrl: 'https://www.typescriptlang.org/docs/',
    snippets: [
      {
        id: 'ts-01',
        title: 'Discriminated Unions with Exhaustiveness Check',
        language: 'typescript',
        code: `type NetworkState =
  | { status: 'idle' }
  | { status: 'loading'; progress: number }
  | { status: 'success'; data: string[] }
  | { status: 'error'; error: Error };

function assertUnreachable(x: never): never {
  throw new Error(\`Unexpected object: \${JSON.stringify(x)}\`);
}

function renderState(state: NetworkState) {
  switch (state.status) {
    case 'idle':
      return 'Ready to fetch';
    case 'loading':
      return \`Loading: \${state.progress}%\`;
    case 'success':
      return \`Received \${state.data.length} items\`;
    case 'error':
      return \`Error: \${state.error.message}\`;
    default:
      // TypeScript compiler errors if a new state variant is added and unhandled!
      return assertUnreachable(state);
  }
}`,
        explanation: 'Type-safe state transitions with complete exhaustiveness checking at compile time.',
        tags: ['types', 'discriminated-unions'],
      },
      {
        id: 'ts-02',
        title: 'The "satisfies" Operator for Exact Literal Inferences',
        language: 'typescript',
        code: `type ThemeConfig = Record<string, string | { r: number; g: number; b: number }>;

const palette = {
  primary: '#0ea5e9',
  secondary: { r: 15, g: 23, b: 42 },
  accent: '#10b981',
} satisfies ThemeConfig;

// 'satisfies' verifies the structure matches ThemeConfig,
// BUT preserves exact literal keys and specific union types!
palette.primary.toUpperCase(); // OK: TS knows primary is a string
console.log(palette.secondary.r); // OK: TS knows secondary has .r property`,
        explanation: 'Enforces type conformity without widening properties to the general union type.',
        tags: ['satisfies', 'typing'],
      },
      {
        id: 'ts-03',
        title: 'Generic Type Utilities & Immutability',
        language: 'typescript',
        code: `// DeepReadonly recursive type
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface UserSettings {
  profile: { name: string; avatar: string };
  permissions: string[];
}

const config: DeepReadonly<UserSettings> = {
  profile: { name: "Alex", avatar: "/avatar.png" },
  permissions: ["admin", "editor"],
};

// config.profile.name = "Sam"; // Error: Cannot assign to 'name' because it is a read-only property`,
        explanation: 'Construct recursive utility types to freeze deeply nested configuration structures.',
        tags: ['generics', 'utilities'],
      },
    ],
  },
  {
    id: 'c-cheatsheet',
    title: 'Modern C & Systems Programming',
    technology: 'C',
    category: 'Languages',
    summary: 'Pointer arithmetic, memory layout, struct alignment, dynamic memory allocation safety, and bitwise manipulation.',
    iconName: 'Cpu',
    officialDocsUrl: 'https://en.cppreference.com/w/c',
    snippets: [
      {
        id: 'c-01',
        title: 'Safe Dynamic Allocation & Free Discipline',
        language: 'c',
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    size_t capacity;
    size_t length;
    int *data;
} IntVector;

IntVector* vector_create(size_t initial_cap) {
    IntVector *vec = malloc(sizeof(IntVector));
    if (!vec) return NULL; // Always check malloc for NULL

    vec->data = malloc(sizeof(int) * initial_cap);
    if (!vec->data) {
        free(vec); // Clean up if second allocation fails
        return NULL;
    }
    vec->capacity = initial_cap;
    vec->length = 0;
    return vec;
}

void vector_destroy(IntVector **vec_ptr) {
    if (vec_ptr && *vec_ptr) {
        free((*vec_ptr)->data);
        (*vec_ptr)->data = NULL;
        free(*vec_ptr);
        *vec_ptr = NULL; // Defend against dangling pointer access
    }
}`,
        explanation: 'Defensive memory allocation pattern preventing double-free and dangling pointer bugs by passing pointer references.',
        tags: ['pointers', 'memory', 'malloc'],
      },
      {
        id: 'c-02',
        title: 'Bitwise Flags & Bitmasks Operations',
        language: 'c',
        code: `#include <stdint.h>
#include <stdbool.h>

#define FLAG_READ    (1U << 0) // 0b0001
#define FLAG_WRITE   (1U << 1) // 0b0010
#define FLAG_EXECUTE (1U << 2) // 0b0100
#define FLAG_ADMIN   (1U << 3) // 0b1000

uint8_t perms = 0;

// Set flags
perms |= (FLAG_READ | FLAG_WRITE);

// Check if flag is set
bool can_write = (perms & FLAG_WRITE) != 0;

// Toggle a flag
perms ^= FLAG_EXECUTE;

// Clear a specific flag safely
perms &= ~FLAG_WRITE;`,
        explanation: 'Compact bit field manipulation used widely in operating systems, device drivers, and network headers.',
        tags: ['bitwise', 'masks'],
      },
    ],
  },
  {
    id: 'java-cheatsheet',
    title: 'Java 21+ Modern Syntax & Concurrency',
    technology: 'Java',
    category: 'Languages',
    summary: 'Virtual threads (Project Loom), records, sealed classes, pattern matching for switch, and modern Stream API pipelines.',
    iconName: 'Coffee',
    officialDocsUrl: 'https://docs.oracle.com/en/java/',
    snippets: [
      {
        id: 'java-01',
        title: 'Virtual Threads (Project Loom) Execution',
        language: 'java',
        code: `import java.util.concurrent.Executors;
import java.time.Duration;

public class VirtualThreadDemo {
    public static void main(String[] args) {
        // Creates a thread pool backed by millions of lightweight virtual threads
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10_000; i++) {
                final int taskId = i;
                executor.submit(() -> {
                    Thread.sleep(Duration.ofMillis(100)); // Non-blocking in virtual threads
                    return "Result " + taskId;
                });
            }
        } // Executor auto-closes and waits for all tasks to finish cleanly!
        System.out.println("All 10,000 tasks executed with near-zero OS thread overhead.");
    }
}`,
        explanation: 'Java 21 Virtual Threads allow high-concurrency throughput without complex reactive code or OS thread exhaustion.',
        tags: ['virtual-threads', 'concurrency'],
      },
      {
        id: 'java-02',
        title: 'Records & Pattern Matching Switch',
        language: 'java',
        code: `sealed interface PaymentMethod permits CreditCard, Crypto, BankTransfer {}

record CreditCard(String cardNumber, String expiry) implements PaymentMethod {}
record Crypto(String walletAddress, String network) implements PaymentMethod {}
record BankTransfer(String iban, String swiftCode) implements PaymentMethod {}

public static String processPayment(PaymentMethod method) {
    return switch (method) {
        case CreditCard(var num, var exp) -> "Charging card ending in " + num.substring(num.length() - 4);
        case Crypto(var addr, var net) -> "Initiating transfer on " + net + " to " + addr;
        case BankTransfer(var iban, _) -> "Direct wire to IBAN: " + iban;
    }; // Exhaustive: compiler ensures every sealed subclass is handled!
}`,
        explanation: 'Sealed interfaces paired with Record patterns replace verbose visitor patterns with clean structural pattern matching.',
        tags: ['records', 'pattern-matching'],
      },
    ],
  },
  {
    id: 'postgres-cheatsheet',
    title: 'PostgreSQL 16 & SQL Performance',
    technology: 'PostgreSQL',
    category: 'Databases',
    summary: 'Window functions (RANK, ROW_NUMBER, LAG), Common Table Expressions (Recursive CTEs), index tuning, and JSONB queries.',
    iconName: 'Database',
    officialDocsUrl: 'https://www.postgresql.org/docs/',
    snippets: [
      {
        id: 'pg-01',
        title: 'Window Functions for Top-N per Group & Cumulative Totals',
        language: 'sql',
        code: `-- Find the top 3 highest-earning projects per category with rank
WITH RankedProjects AS (
  SELECT 
    id,
    title,
    category,
    upvotes,
    ROW_NUMBER() OVER(PARTITION BY category ORDER BY upvotes DESC) as category_rank,
    SUM(upvotes) OVER(PARTITION BY category) as total_category_upvotes
  FROM "Resource"
  WHERE type = 'PROJECT'
)
SELECT id, title, category, upvotes, total_category_upvotes
FROM RankedProjects
WHERE category_rank <= 3
ORDER BY category, category_rank;`,
        explanation: 'Window functions execute across partitions without collapsing rows like a GROUP BY clause does.',
        tags: ['window-functions', 'queries'],
      },
      {
        id: 'pg-02',
        title: 'Atomic Upsert with ON CONFLICT & Partial Indexing',
        language: 'sql',
        code: `-- Atomic Upsert with custom update logic
INSERT INTO "UserNodeProgress" ("userId", "nodeId", "status", "updatedAt")
VALUES ('user_123', 'node_fs_01', 'MASTERED', NOW())
ON CONFLICT ("userId", "nodeId") 
DO UPDATE SET 
  "status" = EXCLUDED."status",
  "updatedAt" = NOW()
WHERE "UserNodeProgress"."status" != EXCLUDED."status";

-- High-performance partial index (only indexes active resources to save 80% RAM)
CREATE INDEX idx_active_trending_resources 
ON "Resource" (upvotesCount DESC) 
WHERE "isTrending" = true;`,
        explanation: 'Atomic upserts prevent race conditions while partial indexes save memory and speed up hotspot queries.',
        tags: ['upsert', 'indexes'],
      },
      {
        id: 'pg-03',
        title: 'Deep JSONB Querying & Indexing',
        language: 'sql',
        code: `-- Query documents inside jsonb column with operators
SELECT id, title, "codeSnippets"->0->>'title' as first_snippet
FROM "CheatSheet"
WHERE "codeSnippets" @> '[{"language": "python"}]';

-- GIN index for blazing fast jsonb containment searches
CREATE INDEX idx_cheatsheets_snippets_gin 
ON "CheatSheet" USING GIN ("codeSnippets" jsonb_path_ops);`,
        explanation: 'Query JSON document payloads directly inside relational PostgreSQL with GIN index acceleration.',
        tags: ['jsonb', 'gin-index'],
      },
    ],
  },
  {
    id: 'docker-cheatsheet',
    title: 'Docker & Multi-Stage Production Builds',
    technology: 'Docker',
    category: 'DevOps & Terminal',
    summary: 'Minimal multi-stage builds, non-root user execution, layer caching optimization, and compose networks.',
    iconName: 'Container',
    officialDocsUrl: 'https://docs.docker.com/',
    snippets: [
      {
        id: 'dk-01',
        title: 'Production Multi-Stage Dockerfile (Node.js/Next.js)',
        language: 'dockerfile',
        code: `# Stage 1: Dependency resolution
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Stage 2: Source build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Minimal non-root runtime image (~90MB)
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "dist/server.js"]`,
        explanation: 'Separating dependencies, compilation, and runtime produces tiny images and keeps secrets out of final production layers.',
        tags: ['dockerfile', 'multi-stage', 'security'],
      },
      {
        id: 'dk-02',
        title: 'Essential CLI Diagnostics & Prune Commands',
        language: 'bash',
        code: `# Inspect container live memory and CPU usage
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# Follow logs with timestamps
docker logs -f --tail 100 --timestamps my-app-container

# Safe garbage collection of unused layers, dangling images, and stopped containers
docker system prune -a --volumes -f`,
        explanation: 'Keep disk clean and trace memory leaks across running containers.',
        tags: ['cli', 'monitoring'],
      },
    ],
  },
  {
    id: 'git-cheatsheet',
    title: 'Git & Command Line Mastery',
    technology: 'Git',
    category: 'DevOps & Terminal',
    summary: 'Interactive rebase, reflog recovery, worktrees, cherry-picking, and clean squashing.',
    iconName: 'GitBranch',
    officialDocsUrl: 'https://git-scm.com/doc',
    snippets: [
      {
        id: 'git-01',
        title: 'Recover Lost Commits with git reflog',
        language: 'bash',
        code: `# View history of HEAD movements even after hard reset or dropped stash
git reflog

# Output looks like:
# 7b29a10 HEAD@{0}: reset: moving to HEAD~1
# 3a18e42 HEAD@{1}: commit: Add critical authentication logic

# Restore the exact commit into a recovery branch
git checkout -b recovery-branch 3a18e42

# You're back! The commit is safely restored.`,
        explanation: 'Git reflog tracks all head transitions, making it almost impossible to lose committed work.',
        tags: ['reflog', 'recovery'],
      },
      {
        id: 'git-02',
        title: 'Git Worktree for Zero-Stash Context Switching',
        language: 'bash',
        code: `# Work on a hotfix without stashing or changing your current working branch
git worktree add ../hotfix-branch-checkout hotfix/fix-auth-leak

# Jump into the parallel folder
cd ../hotfix-branch-checkout
# Do work, test, commit, and push!

# When done, remove worktree
cd -
git worktree remove ../hotfix-branch-checkout`,
        explanation: 'Worktrees allow you to check out multiple branches simultaneously in separate directories on the same git repo.',
        tags: ['worktree', 'productivity'],
      },
    ],
  },
  {
    id: 'webpack-vite-cheatsheet',
    title: 'Vite & Webpack Bundlers',
    technology: 'Vite / Webpack',
    category: 'Bundlers & Tools',
    summary: 'Rollup manual chunking, Vite server proxying, path aliasing, and bundle analysis.',
    iconName: 'Package',
    officialDocsUrl: 'https://vite.dev/config/',
    snippets: [
      {
        id: 'vite-01',
        title: 'Vite Manual Chunk Splitting & Compression',
        language: 'typescript',
        code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-libs';
          }
        },
      },
    },
  },
});`,
        explanation: 'Splitting heavy vendor modules into standalone cacheable chunks slashes initial load times.',
        tags: ['vite', 'chunks', 'bundler'],
      },
    ],
  },
];
