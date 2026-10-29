import Fuse from 'fuse.js';
import { ROADMAPS_DATA } from '../data/roadmapsData';
import { CHEATSHEETS_DATA } from '../data/cheatsheetsData';
import { PROJECTS_DATA } from '../data/projectsData';
import { TOOLS_DATA } from '../data/toolsData';
import { UnifiedSearchItem } from '../types';

export function getAllSearchableItems(): UnifiedSearchItem[] {
  const items: UnifiedSearchItem[] = [];

  // Roadmaps
  ROADMAPS_DATA.forEach((rm) => {
    const nodeTopics = rm.nodes.flatMap((n) => n.topics);
    items.push({
      id: rm.id,
      title: rm.title,
      description: rm.description,
      category: rm.category,
      type: 'roadmap',
      targetView: 'roadmaps',
      targetId: rm.id,
      tags: [rm.difficulty, 'Career Path', ...nodeTopics],
    });
  });

  // Cheat Sheets
  CHEATSHEETS_DATA.forEach((cs) => {
    const snippetTitles = cs.snippets.map((s) => s.title);
    items.push({
      id: cs.id,
      title: `${cs.title} (${cs.technology})`,
      description: cs.summary,
      category: cs.category,
      type: 'cheatsheet',
      targetView: 'cheatsheets',
      targetId: cs.id,
      tags: [cs.technology, ...snippetTitles],
    });
  });

  // Projects
  PROJECTS_DATA.forEach((p) => {
    items.push({
      id: p.id,
      title: p.title,
      description: p.objective,
      category: p.domain,
      type: 'project',
      targetView: 'projects',
      targetId: p.id,
      tags: [p.difficulty, p.domain, ...p.techStack],
    });
  });

  // Tools
  TOOLS_DATA.forEach((t) => {
    items.push({
      id: t.id,
      title: t.name,
      description: t.tagline,
      category: t.category,
      type: 'tool',
      targetView: 'tools',
      targetId: t.id,
      tags: [t.pricingModel, ...t.tags],
    });
  });

  return items;
}

let fuseInstance: Fuse<UnifiedSearchItem> | null = null;

export function getFuseSearch(): Fuse<UnifiedSearchItem> {
  if (!fuseInstance) {
    const items = getAllSearchableItems();
    fuseInstance = new Fuse(items, {
      keys: [
        { name: 'title', weight: 2.0 },
        { name: 'tags', weight: 1.5 },
        { name: 'description', weight: 1.0 },
        { name: 'category', weight: 0.8 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }
  return fuseInstance;
}

export function searchAllResources(query: string, limit = 12): UnifiedSearchItem[] {
  if (!query || query.trim() === '') {
    return getAllSearchableItems().slice(0, limit);
  }
  const fuse = getFuseSearch();
  const results = fuse.search(query.trim());
  return results.slice(0, limit).map((r) => r.item);
}
