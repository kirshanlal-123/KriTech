import React, { useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  /** Optional container element ref. If omitted, tracks window scroll */
  targetRef?: React.RefObject<HTMLElement | null>;
  showPercentageBadge?: boolean;
  colorScheme?: 'cyan' | 'violet' | 'amber' | 'emerald';
  className?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  targetRef,
  showPercentageBadge = false,
  colorScheme = 'cyan',
  className = '',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      if (targetRef && targetRef.current) {
        const el = targetRef.current;
        const totalScroll = el.scrollHeight - el.clientHeight;
        if (totalScroll <= 0) {
          setProgress(0);
          return;
        }
        const currentScroll = el.scrollTop;
        const pct = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
        setProgress(Math.round(pct));
      } else {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight <= 0) {
          setProgress(0);
          return;
        }
        const currentScroll = window.scrollY;
        const pct = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setProgress(Math.round(pct));
      }
    };

    if (targetRef && targetRef.current) {
      const el = targetRef.current;
      el.addEventListener('scroll', calculateProgress, { passive: true });
      calculateProgress();
      return () => el.removeEventListener('scroll', calculateProgress);
    } else {
      window.addEventListener('scroll', calculateProgress, { passive: true });
      window.addEventListener('resize', calculateProgress, { passive: true });
      calculateProgress();
      return () => {
        window.removeEventListener('scroll', calculateProgress);
        window.removeEventListener('resize', calculateProgress);
      };
    }
  }, [targetRef]);

  const getGradient = () => {
    switch (colorScheme) {
      case 'violet':
        return 'from-violet-500 via-purple-500 to-indigo-400';
      case 'amber':
        return 'from-amber-500 via-orange-500 to-yellow-400';
      case 'emerald':
        return 'from-emerald-500 via-teal-500 to-cyan-400';
      case 'cyan':
      default:
        return 'from-cyan-500 via-blue-500 to-indigo-500';
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Background Track */}
      <div className="w-full h-1 bg-neutral-800/40 overflow-hidden">
        {/* Active Animated Fill */}
        <div
          className={`h-full bg-gradient-to-r ${getGradient()} transition-all duration-75 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Optional Scrolled Percentage Badge */}
      {showPercentageBadge && progress > 2 && (
        <div
          className="absolute right-3 top-2 px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300 bg-neutral-900/90 border border-neutral-800 shadow-sm transition-opacity"
        >
          <span className="text-cyan-400 font-semibold tabular-nums">{progress}%</span> read
        </div>
      )}
    </div>
  );
};
