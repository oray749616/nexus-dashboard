import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, X, StickyNote } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  color: string;
  createdAt: number;
}

const COLORS = [
  'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100 border-amber-200 dark:border-amber-800',
  'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800',
  'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-100 border-sky-200 dark:border-sky-800',
  'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-100 border-rose-200 dark:border-rose-800',
  'bg-violet-100 dark:bg-violet-900/40 text-violet-900 dark:text-violet-100 border-violet-200 dark:border-violet-800',
];

export const QuickNotesWidget: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('nexus_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    localStorage.setItem('nexus_notes', JSON.stringify(notes));
  }, [notes]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    if (notes.length >= 10) return;

    const newNote: Note = {
      id: uuidv4(),
      text: newNoteText.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      createdAt: Date.now(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteText('');
    setIsAdding(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="w-80 h-96 flex flex-col" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          Quick Notes
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
            {notes.length}/10
          </span>
        </h3>
        <button
          onClick={() => notes.length < 10 && setIsAdding(true)}
          disabled={notes.length >= 10 || isAdding}
          className={`p-1.5 rounded-lg transition-all ${
            notes.length >= 10 || isAdding
              ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 active:scale-95'
          }`}
          title={notes.length >= 10 ? "Maximum notes reached" : "Add note"}
        >
          <Plus size={18} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="relative">
            <textarea
              autoFocus
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm text-slate-700 dark:text-slate-200 resize-none h-24 shadow-sm placeholder-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAdd(e);
                }
                if (e.key === 'Escape') setIsAdding(false);
              }}
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                >
                <X size={14} />
                </button>
            </div>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin pb-2">
        {notes.length === 0 && !isAdding ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <StickyNote size={40} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">No notes yet</p>
            <p className="text-xs opacity-70 mt-1">Click + to create one</p>
          </div>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              className={`relative group p-4 rounded-xl border transition-all hover:shadow-md animate-in slide-in-from-bottom-2 fade-in duration-300 ${note.color}`}
            >
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words pr-5">
                {note.text}
              </p>
              
              <button
                onClick={(e) => {
                   e.stopPropagation();
                   deleteNote(note.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-black/5 dark:hover:bg-black/20 rounded-lg text-current"
                title="Delete note"
              >
                <X size={14} />
              </button>
              
              <div className="absolute bottom-2 right-3 text-[10px] opacity-50 font-medium">
                {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};