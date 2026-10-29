import { DevTool, NodeStatus, UserProgressState } from '../types';

const STORAGE_KEY = 'devnexus_user_progress_v1';
const THEME_KEY = 'devnexus_theme_mode';

const DEFAULT_STATE: UserProgressState = {
  nodeStatuses: {
    'fs-01': 'mastered',
    'fs-02': 'in_progress',
    'sd-01': 'in_progress',
  },
  upvotedResourceIds: ['tool-01', 'tool-03', 'proj-01'],
  bookmarkedResourceIds: ['python-cheatsheet', 'proj-02', 'sd-03'],
  customToolSubmissions: [],
};

export function loadUserProgress(): UserProgressState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
    };
  } catch (e) {
    console.error('Failed to parse user progress from localStorage', e);
    return DEFAULT_STATE;
  }
}

export function saveUserProgress(state: UserProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
}

export function loadThemePreference(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {
    // fallback
  }
  return 'dark';
}

export function saveThemePreference(theme: 'dark' | 'light'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    // fallback
  }
}
