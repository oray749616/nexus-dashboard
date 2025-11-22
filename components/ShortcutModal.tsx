import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Shortcut } from '../types';

interface ShortcutModalProps {
  isOpen: boolean;
  type: 'add' | 'edit' | null;
  initialData?: Shortcut;
  onClose: () => void;
  onSave: (title: string, url: string) => void;
}

export const ShortcutModal: React.FC<ShortcutModalProps> = ({
  isOpen,
  type,
  initialData,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
    } else {
      setTitle('');
      setUrl('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    
    // Basic URL validation/fix
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
    }
    
    onSave(title, finalUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content - Enhanced transparency for glass effect */}
      <div className="relative w-full max-w-xl bg-white/60 dark:bg-slate-900/80 backdrop-blur-2xl rounded-lg shadow-2xl border border-white/40 dark:border-white/10 p-8 transform transition-all animate-in fade-in scale-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors hover:bg-white/50 dark:hover:bg-white/10 rounded-full p-1"
        >
          <X size={16} />
        </button>

        <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-1">
          {type === 'add' ? 'Add New Shortcut' : 'Edit Shortcut'}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-8 font-medium">
          {type === 'add' ? 'Enter the details for your website.' : 'Update your shortcut details.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase ml-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., GitHub"
              className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-slate-950/50 border border-white/50 dark:border-white/10 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-input font-semibold"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wider uppercase ml-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg bg-white/70 dark:bg-slate-950/50 border border-white/50 dark:border-white/10 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-input font-semibold"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4">
             <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-6 rounded-lg text-slate-600 dark:text-slate-400 font-bold hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all"
            >
              {type === 'add' ? 'Add Shortcut' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};