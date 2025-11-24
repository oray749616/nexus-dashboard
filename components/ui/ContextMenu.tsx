'use client'

import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, PlusCircle, RefreshCw } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  isShortcutTarget: boolean;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  visible,
  isShortcutTarget,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (visible) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  // Prevent menu from going off-screen
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 150);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[160px] bg-white/90 dark:bg-slate-800/95 backdrop-blur-xl rounded-lg shadow-lg shadow-black/5 dark:shadow-black/20 border border-white/50 dark:border-white/10 p-1.5 animate-in fade-in zoom-in-95 duration-100 origin-top-left"
      style={{ top: adjustedY, left: adjustedX }}
    >
      <ul className="flex flex-col gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {!isShortcutTarget && (
          <li>
            <button
              onClick={onAdd}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left"
            >
              <PlusCircle size={16} />
              <span>Add Shortcut</span>
            </button>
          </li>
        )}

        {isShortcutTarget && (
          <>
            <li>
              <button
                onClick={onEdit}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left"
              >
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
            </li>
            <li>
              <button
                onClick={onDelete}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 transition-colors text-left"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </li>
          </>
        )}

        {/* Separator */}
        <li className="my-1">
          <div className="h-px bg-slate-200 dark:bg-slate-700" />
        </li>

        {/* Refresh Button */}
        <li>
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-500/20 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-left"
          >
            <RefreshCw size={16} />
            <span>Refresh Page</span>
          </button>
        </li>
      </ul>
    </div>
  );
};