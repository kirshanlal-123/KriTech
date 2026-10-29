import React, { useState } from 'react';
import { Compass, CheckCircle2, Clock, CircleDot, ExternalLink, Play, ChevronRight, X, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Roadmap, RoadmapNode, NodeStatus } from '../../types';
import { ROADMAPS_DATA } from '../../data/roadmapsData';

interface RoadmapsViewProps {
  initialRoadmapId?: string;
  nodeStatuses: Record<string, NodeStatus>;
  onUpdateNodeStatus: (nodeId: string, status: NodeStatus) => void;
}

export const RoadmapsView: React.FC<RoadmapsViewProps> = ({
  initialRoadmapId,
  nodeStatuses,
  onUpdateNodeStatus,
}) => {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(
    initialRoadmapId || ROADMAPS_DATA[0].id
  );
  const [activeNode, setActiveNode] = useState<RoadmapNode | null>(null);

  const currentRoadmap =
    ROADMAPS_DATA.find((r) => r.id === selectedRoadmapId) || ROADMAPS_DATA[0];

  // Calculate completion percentage for the current roadmap
  const totalNodes = currentRoadmap.nodes.length;
  const masteredCount = currentRoadmap.nodes.filter(
    (n) => nodeStatuses[n.id] === 'mastered'
  ).length;
  const inProgressCount = currentRoadmap.nodes.filter(
    (n) => nodeStatuses[n.id] === 'in_progress'
  ).length;
  const progressPercent = totalNodes > 0 ? Math.round((masteredCount / totalNodes) * 100) : 0;

  // Group nodes by stage/categoryGroup
  const stages: { stageName: string; nodes: RoadmapNode[] }[] = [];
  currentRoadmap.nodes.forEach((node) => {
    let stage = stages.find((s) => s.stageName === node.categoryGroup);
    if (!stage) {
      stage = { stageName: node.categoryGroup, nodes: [] };
      stages.push(stage);
    }
    stage.nodes.push(node);
  });

  const handleStatusChange = (nodeId: string, newStatus: NodeStatus) => {
    onUpdateNodeStatus(nodeId, newStatus);
    if (newStatus === 'mastered') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#06b6d4', '#10b981', '#3b82f6'],
        });
      } catch (e) {
        // fallback
      }
    }
  };

  const getNodeStatusBadge = (status: NodeStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mastered</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
            <CircleDot className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>To Learn</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header and Roadmap Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-cyan-400" />
            <span>Interactive Engineering Roadmaps</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Visual skill graphs with status tracking, official documentation, and curated masterclasses.
          </p>
        </div>

        {/* Track Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
          {ROADMAPS_DATA.map((rm) => (
            <button
              key={rm.id}
              onClick={() => setSelectedRoadmapId(rm.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedRoadmapId === rm.id
                  ? 'bg-neutral-800 text-cyan-400 shadow-sm border border-neutral-700/60'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {rm.title}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap Overview Card */}
      <div className="p-6 rounded-xl bg-neutral-900/70 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <span>{currentRoadmap.category}</span>
            <span>·</span>
            <span className="text-cyan-400">{currentRoadmap.difficulty}</span>
            <span>·</span>
            <span>~{currentRoadmap.estimatedHours} Hours Curriculum</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-100">{currentRoadmap.title}</h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {currentRoadmap.description}
          </p>
        </div>

        {/* Progress Metric Box */}
        <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800/80 min-w-[220px] shrink-0 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-mono">Your Track Progress</span>
            <span className="text-cyan-400 font-mono font-bold tabular-nums text-sm">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>{masteredCount} Mastered</span>
            <span>·</span>
            <span>{inProgressCount} Learning</span>
            <span>·</span>
            <span>{totalNodes} Total</span>
          </div>
        </div>
      </div>

      {/* Visual Roadmap Sequence */}
      <div className="space-y-8">
        {stages.map((stage, sIdx) => (
          <div key={sIdx} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                {stage.stageName}
              </span>
              <div className="h-px bg-neutral-800 flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stage.nodes.map((node) => {
                const status = nodeStatuses[node.id] || 'to_learn';
                const isSelected = activeNode?.id === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setActiveNode(node)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-neutral-800/90 border-cyan-500 shadow-md shadow-cyan-950/40'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs text-neutral-400 font-mono">
                          Step {node.orderIndex} · {node.estimatedHours}h
                        </span>
                        {getNodeStatusBadge(status)}
                      </div>

                      <h3 className="text-sm font-semibold text-neutral-100 leading-snug">
                        {node.title}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>

                      {/* Topic Highlights */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {node.topics.slice(0, 3).map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-800/90 text-neutral-300"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                      <span className="text-cyan-400 flex items-center gap-1">
                        View Resources & Guides <ChevronRight className="w-3.5 h-3.5" />
                      </span>

                      {/* Inline quick toggle buttons */}
                      <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleStatusChange(node.id, 'to_learn')}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                            status === 'to_learn'
                              ? 'bg-neutral-800 text-neutral-200'
                              : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => handleStatusChange(node.id, 'in_progress')}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                            status === 'in_progress'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                              : 'text-neutral-500 hover:text-amber-400'
                          }`}
                        >
                          Learning
                        </button>
                        <button
                          onClick={() => handleStatusChange(node.id, 'mastered')}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                            status === 'mastered'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                              : 'text-neutral-500 hover:text-emerald-400'
                          }`}
                        >
                          Done ✓
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Node Detail Drawer / Modal */}
      {activeNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 flex items-start justify-between gap-4 bg-neutral-950/60">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mb-1">
                  <span>{activeNode.categoryGroup}</span>
                  <span>·</span>
                  <span>Step {activeNode.orderIndex}</span>
                  <span>·</span>
                  <span>{activeNode.estimatedHours} Hours</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-100">{activeNode.title}</h3>
              </div>
              <button
                onClick={() => setActiveNode(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-neutral-400 mb-1.5">
                  Core Objective
                </h4>
                <p className="text-neutral-300 leading-relaxed text-xs sm:text-sm">
                  {activeNode.description}
                </p>
              </div>

              {/* Status Switcher Bar */}
              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">Current Status:</span>
                <div className="flex items-center gap-2">
                  {(['to_learn', 'in_progress', 'mastered'] as NodeStatus[]).map((st) => {
                    const isCur = (nodeStatuses[activeNode.id] || 'to_learn') === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(activeNode.id, st)}
                        className={`px-3 py-1 text-xs rounded-md font-mono transition-colors cursor-pointer ${
                          isCur
                            ? st === 'mastered'
                              ? 'bg-emerald-600 text-white font-medium'
                              : st === 'in_progress'
                              ? 'bg-amber-600 text-white font-medium'
                              : 'bg-neutral-700 text-neutral-100 font-medium'
                            : 'bg-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {st === 'to_learn' ? 'To Learn' : st === 'in_progress' ? 'In Progress' : 'Mastered'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prerequisites */}
              {activeNode.prerequisites && activeNode.prerequisites.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase text-neutral-400 mb-2">
                    Prerequisites
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.prerequisites.map((req, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 text-xs font-mono"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Topics Checklist */}
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase text-neutral-400 mb-2">
                  Curriculum Competencies
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeNode.topics.map((tpc, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80 flex items-center gap-2 text-xs text-neutral-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{tpc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Documentation & Video Links */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <h4 className="text-xs font-mono font-semibold uppercase text-neutral-400">
                  Curated Reference Material
                </h4>

                <div className="space-y-2">
                  {/* Doc Link */}
                  <a
                    href={activeNode.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 flex items-center justify-between text-neutral-200 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-medium">Official Documentation & Standards</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                  </a>

                  {/* Video Tutorial */}
                  {activeNode.videoUrl && (
                    <a
                      href={activeNode.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 flex items-center justify-between text-neutral-200 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Play className="w-4 h-4 text-red-400" />
                        <div>
                          <div className="text-xs font-medium">
                            Video Deep-Dive: {activeNode.videoChannel}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            Duration: {activeNode.videoDuration}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">
                Changes saved to local device profile
              </span>
              <button
                onClick={() => setActiveNode(null)}
                className="px-4 py-1.5 text-xs rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
