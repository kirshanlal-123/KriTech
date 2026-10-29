export type ViewMode = 'home' | 'roadmaps' | 'cheatsheets' | 'projects' | 'tools' | 'bookmarks' | 'architecture';

export type NodeStatus = 'to_learn' | 'in_progress' | 'mastered';

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  categoryGroup: string;
  docUrl: string;
  videoUrl?: string;
  videoChannel?: string;
  videoDuration?: string;
  estimatedHours: number;
  prerequisites: string[];
  topics: string[];
}

export interface Roadmap {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  estimatedHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  nodes: RoadmapNode[];
}

export interface CheatSnippet {
  id: string;
  title: string;
  language: string;
  code: string;
  explanation: string;
  tags?: string[];
}

export interface CheatSheet {
  id: string;
  title: string;
  technology: string;
  category: 'Languages' | 'Databases' | 'Bundlers & Tools' | 'APIs' | 'DevOps & Terminal';
  summary: string;
  iconName: string;
  officialDocsUrl: string;
  snippets: CheatSnippet[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  domain: 'Full-Stack' | 'Systems' | 'AI / ML' | 'Mobile' | 'DevOps & Cloud' | 'Security';
  objective: string;
  techStack: string[];
  features: string[];
  architecture: string;
  suggestedApis: string[];
  estimatedWeeks: number;
  githubStarter?: string;
  upvotes: number;
}

export interface DevTool {
  id: string;
  name: string;
  tagline: string;
  category: 'AI Coding' | 'API & Backend' | 'Frontend & UI' | 'DevOps & Cloud' | 'Database' | 'Security & Testing';
  pricingModel: 'Free' | 'Freemium' | 'Open Source' | 'Paid';
  websiteUrl: string;
  repoUrl?: string;
  tags: string[];
  upvotes: number;
  isTrending?: boolean;
}

export interface UnifiedSearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'roadmap' | 'cheatsheet' | 'project' | 'tool';
  targetView: ViewMode;
  targetId?: string;
  tags: string[];
}

export interface UserProgressState {
  nodeStatuses: Record<string, NodeStatus>;
  upvotedResourceIds: string[];
  bookmarkedResourceIds: string[];
  customToolSubmissions: DevTool[];
}
