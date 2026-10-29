import React, { useState, useEffect } from 'react';
import { ViewMode, NodeStatus, DevTool } from './types';
import { loadUserProgress, saveUserProgress, loadThemePreference, saveThemePreference } from './lib/storage';
import { ROADMAPS_DATA } from './data/roadmapsData';
import { CHEATSHEETS_DATA } from './data/cheatsheetsData';
import { PROJECTS_DATA } from './data/projectsData';
import { TOOLS_DATA } from './data/toolsData';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/common/CommandPalette';

import { HomeView } from './components/views/HomeView';
import { RoadmapsView } from './components/views/RoadmapsView';
import { CheatSheetsView } from './components/views/CheatSheetsView';
import { ProjectsView } from './components/views/ProjectsView';
import { ToolsView } from './components/views/ToolsView';
import { BookmarksView } from './components/views/BookmarksView';
import { SchemaView } from './components/views/SchemaView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [targetDetailId, setTargetDetailId] = useState<string | undefined>(undefined);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Persistent user state
  const [userProgress, setUserProgress] = useState(loadUserProgress);

  // Sync theme with DOM root class
  useEffect(() => {
    const savedTheme = loadThemePreference();
    setIsDarkMode(savedTheme === 'dark');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    saveThemePreference(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: ViewMode, targetId?: string) => {
    setCurrentView(view);
    setTargetDetailId(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleUpvote = (id: string) => {
    setUserProgress((prev) => {
      const exists = prev.upvotedResourceIds.includes(id);
      const nextUpvotes = exists
        ? prev.upvotedResourceIds.filter((item) => item !== id)
        : [...prev.upvotedResourceIds, id];
      const nextState = { ...prev, upvotedResourceIds: nextUpvotes };
      saveUserProgress(nextState);
      return nextState;
    });
  };

  const handleToggleBookmark = (id: string) => {
    setUserProgress((prev) => {
      const exists = prev.bookmarkedResourceIds.includes(id);
      const nextBookmarks = exists
        ? prev.bookmarkedResourceIds.filter((item) => item !== id)
        : [...prev.bookmarkedResourceIds, id];
      const nextState = { ...prev, bookmarkedResourceIds: nextBookmarks };
      saveUserProgress(nextState);
      return nextState;
    });
  };

  const handleUpdateNodeStatus = (nodeId: string, status: NodeStatus) => {
    setUserProgress((prev) => {
      const nextState = {
        ...prev,
        nodeStatuses: {
          ...prev.nodeStatuses,
          [nodeId]: status,
        },
      };
      saveUserProgress(nextState);
      return nextState;
    });
  };

  const handleAddCustomTool = (tool: DevTool) => {
    setUserProgress((prev) => {
      const nextTools = [tool, ...prev.customToolSubmissions];
      const nextState = {
        ...prev,
        customToolSubmissions: nextTools,
      };
      saveUserProgress(nextState);
      return nextState;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Subtle Tech Grid */}
      <div className="fixed inset-0 tech-grid-pattern pointer-events-none opacity-40 z-0" />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          bookmarkCount={userProgress.bookmarkedResourceIds.length}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
          {currentView === 'home' && (
            <HomeView
              onNavigate={handleNavigate}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              trendingTools={TOOLS_DATA}
              featuredCheatSheets={CHEATSHEETS_DATA}
              featuredProjects={PROJECTS_DATA}
              upvotedIds={userProgress.upvotedResourceIds}
              bookmarkedIds={userProgress.bookmarkedResourceIds}
              onToggleUpvote={handleToggleUpvote}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentView === 'roadmaps' && (
            <RoadmapsView
              initialRoadmapId={targetDetailId}
              nodeStatuses={userProgress.nodeStatuses}
              onUpdateNodeStatus={handleUpdateNodeStatus}
            />
          )}

          {currentView === 'cheatsheets' && (
            <CheatSheetsView
              initialCheatSheetId={targetDetailId}
              bookmarkedIds={userProgress.bookmarkedResourceIds}
              onToggleBookmark={handleToggleBookmark}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsView
              initialProjectId={targetDetailId}
              bookmarkedIds={userProgress.bookmarkedResourceIds}
              upvotedIds={userProgress.upvotedResourceIds}
              onToggleBookmark={handleToggleBookmark}
              onToggleUpvote={handleToggleUpvote}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'tools' && (
            <ToolsView
              customTools={userProgress.customToolSubmissions}
              upvotedIds={userProgress.upvotedResourceIds}
              bookmarkedIds={userProgress.bookmarkedResourceIds}
              onToggleUpvote={handleToggleUpvote}
              onToggleBookmark={handleToggleBookmark}
              onAddCustomTool={handleAddCustomTool}
            />
          )}

          {currentView === 'bookmarks' && (
            <BookmarksView
              bookmarkedIds={userProgress.bookmarkedResourceIds}
              nodeStatuses={userProgress.nodeStatuses}
              onToggleBookmark={handleToggleBookmark}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'architecture' && <SchemaView />}
        </main>

        {/* Global Command Palette Modal */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
      </div>
    </div>
  );
}
