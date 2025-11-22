import React from 'react';
import { Shortcut } from '../types';

interface ShortcutGridProps {
  shortcuts: Shortcut[];
  onContextMenu: (e: React.MouseEvent, shortcutId: string | null) => void;
}

export const ShortcutGrid: React.FC<ShortcutGridProps> = ({ shortcuts, onContextMenu }) => {
  
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return '';
    }
  };

  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full max-w-[90%] lg:max-w-[1400px] mx-auto px-4 pb-20"
      onContextMenu={(e) => onContextMenu(e, null)} // Background context menu
    >
      {shortcuts.map((shortcut) => (
        <a
          key={shortcut.id}
          href={shortcut.url}
          target="_blank" 
          rel="noopener noreferrer"
          onContextMenu={(e) => {
            e.stopPropagation(); // Stop bubbling to background
            onContextMenu(e, shortcut.id);
          }}
          className="group relative flex flex-col items-center justify-center p-8 h-40 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md rounded-lg shadow-sm border border-white/40 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft active:scale-95 cursor-pointer no-underline select-none"
        >
          <div className="w-14 h-14 mb-4 relative flex items-center justify-center">
            <img 
              src={getFaviconUrl(shortcut.url)} 
              alt={shortcut.title}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                // Fallback if image fails
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 dark:text-slate-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
              }}
            />
          </div>
          
          <span className="text-base font-bold text-slate-700 dark:text-slate-300 tracking-wide text-center line-clamp-1 w-full px-2 z-10">
            {shortcut.title}
          </span>
        </a>
      ))}
      
      {/* Invisible spacer for catching right clicks in the grid area efficiently */}
      {shortcuts.length === 0 && (
         <div className="col-span-full py-20 text-center text-slate-400 dark:text-slate-500 font-light pointer-events-none">
            Right-click anywhere to add a shortcut
         </div>
      )}
    </div>
  );
};