import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'text',
  title,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code to clipboard', e);
    }
  };

  const lines = code.trim().split('\n');

  // Simple syntax highlighter that colors common keywords, strings, comments, numbers safely without external heavy runtimes
  const highlightLine = (line: string): React.ReactNode => {
    // Check if line is a comment
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('--')) {
      return <span className="text-neutral-500 italic">{line}</span>;
    }

    // Split tokens while preserving strings
    const tokens = line.split(/(".*?"|'.*?'|`.*?`|\b(?:def|class|async|await|return|match|case|import|from|export|function|const|let|var|type|interface|SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|OVER|PARTITION BY|struct|malloc|free|record|sealed|public|static|void)\b)/g);

    return tokens.map((token, i) => {
      if (!token) return null;
      if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
        return <span key={i} className="text-emerald-400 dark:text-emerald-300">{token}</span>;
      }
      if (/^(def|class|async|await|return|match|case|import|from|export|function|const|let|var|type|interface|SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|OVER|PARTITION BY|struct|malloc|free|record|sealed|public|static|void)$/.test(token)) {
        return <span key={i} className="text-cyan-400 dark:text-cyan-300 font-medium">{token}</span>;
      }
      if (/^\d+(\.\d+)?$/.test(token)) {
        return <span key={i} className="text-amber-400 dark:text-amber-300">{token}</span>;
      }
      return <span key={i}>{token}</span>;
    });
  };

  return (
    <div className="relative group rounded-lg border border-neutral-800 bg-neutral-950/90 overflow-hidden font-mono text-xs my-2">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-800/80 bg-neutral-900/60 text-neutral-400">
        <div className="flex items-center gap-2">
          {title ? (
            <span className="font-sans text-xs text-neutral-300 font-medium">{title}</span>
          ) : (
            <span className="text-[11px] uppercase tracking-wider text-neutral-400">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-colors text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-3.5 overflow-x-auto text-neutral-200 leading-relaxed max-h-[420px]">
        <pre className="table w-full">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row hover:bg-neutral-900/40">
              {showLineNumbers && (
                <span className="table-cell select-none pr-4 text-right text-neutral-600 text-[11px] tabular-nums w-8">
                  {idx + 1}
                </span>
              )}
              <span className="table-cell whitespace-pre">{highlightLine(line)}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
