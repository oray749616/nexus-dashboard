'use client'

import React, { useRef, useMemo, useReducer, useState } from 'react';
import { Shortcut } from '../types';

interface ShortcutGridProps {
  shortcuts: Shortcut[];
  onContextMenu: (e: React.MouseEvent, shortcutId: string | null) => void;
}

export const ShortcutGrid: React.FC<ShortcutGridProps> = ({ shortcuts, onContextMenu }) => {
  // Use useRef to avoid unnecessary re-renders
  const faviconIndexesRef = useRef<Record<string, number>>({});
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  // Track shortcuts with failed custom icon loads
  const [customIconFailed, setCustomIconFailed] = useState<Set<string>>(new Set());

  // Multiple favicon service fallback chain
  const getFaviconUrls = (url: string): string[] => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const origin = urlObj.origin;

      return [
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        `https://icons.duckduckgo.com/ip3/${domain}.ico`,
        `https://icon.horse/icon/${domain}`,
        `${origin}/favicon.ico`,
        `https://logo.clearbit.com/${domain}`,
      ];
    } catch {
      return [];
    }
  };

  // Cache favicon URLs mapping to avoid recalculation on every render
  const faviconUrlsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    shortcuts.forEach(shortcut => {
      map[shortcut.id] = getFaviconUrls(shortcut.url);
    });
    return map;
  }, [shortcuts]);

  const handleFaviconError = (shortcutId: string) => {
    const urls = faviconUrlsMap[shortcutId] || [];
    const currentIndex = faviconIndexesRef.current[shortcutId] || 0;
    const nextIndex = currentIndex + 1;

    // If there are more fallback URLs, try the next one
    if (nextIndex < urls.length) {
      faviconIndexesRef.current[shortcutId] = nextIndex;
      forceUpdate(); // Only trigger re-render when necessary
    }
  };

  const handleCustomIconError = (shortcutId: string) => {
    // Mark custom icon as failed, fallback to favicon
    setCustomIconFailed(prev => new Set(prev).add(shortcutId));
  };

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-[90%] lg:max-w-[1400px] mx-auto px-4 pb-20"
      onContextMenu={(e) => onContextMenu(e, null)} // Background context menu
    >
      {shortcuts.map((shortcut) => {
        // Prioritize custom icon, but fallback if loading fails
        const hasCustomIcon = !!shortcut.customIcon && !customIconFailed.has(shortcut.id);
        const faviconUrls = faviconUrlsMap[shortcut.id] || [];
        const currentIndex = faviconIndexesRef.current[shortcut.id] || 0;
        const currentFaviconUrl = faviconUrls[currentIndex] || '';
        const allFailed = !hasCustomIcon && currentIndex >= faviconUrls.length;

        return (
          <a
            key={shortcut.id}
            href={shortcut.url}
            onContextMenu={(e) => {
              e.stopPropagation(); // Stop bubbling to background
              onContextMenu(e, shortcut.id);
            }}
            className="group relative flex flex-col items-center justify-center p-8 h-40 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft active:scale-95 cursor-pointer no-underline select-none"
          >
            <div className="w-14 h-14 mb-4 relative flex items-center justify-center">
              {hasCustomIcon ? (
                // Display user-uploaded custom icon, fallback to favicon if fails
                <img
                  src={shortcut.customIcon}
                  alt={shortcut.title}
                  className="w-10 h-10 object-contain"
                  onError={() => handleCustomIconError(shortcut.id)}
                />
              ) : !allFailed ? (
                // Use icon from fallback chain
                <img
                  src={currentFaviconUrl}
                  alt={shortcut.title}
                  className="w-10 h-10 object-contain"
                  onError={() => handleFaviconError(shortcut.id)}
                />
              ) : (
                // Display default icon after all URLs fail
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-400 dark:text-slate-500"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              )}
            </div>

            <span className="text-lg font-bold text-slate-700 dark:text-slate-300 tracking-wide text-center line-clamp-1 w-full px-2 z-10">
              {shortcut.title}
            </span>
          </a>
        );
      })}

      {/* Invisible spacer for catching right clicks in the grid area efficiently */}
      {shortcuts.length === 0 && (
         <div className="col-span-full py-20 text-center text-slate-400 dark:text-slate-500 font-light pointer-events-none">
            Right-click anywhere to add a shortcut
         </div>
      )}
    </div>
  );
};
