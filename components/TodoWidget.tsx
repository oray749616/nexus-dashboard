
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export const TodoWidget: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('nexus_todos');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration for old todos without createdAt
      return parsed.map((t: any) => ({
        ...t,
        createdAt: t.createdAt || Date.now()
      }));
    }
    return [
      { id: '1', text: 'Welcome to your new dashboard', completed: false, createdAt: Date.now() },
      { id: '2', text: 'Add your first task', completed: false, createdAt: Date.now() }
    ];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('nexus_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Stop propagation to prevent closing the widget
    e.stopPropagation();
    
    setTodos([...todos, {
      id: uuidv4(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now()
    }]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (e: React.MouseEvent, id: string) => {
    // Critical: Stop propagation to prevent the "click outside" handler in Dock.tsx 
    // from triggering because the element is about to be removed from the DOM.
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setTodos(todos.filter(t => t.id !== id));
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="w-80 h-96 flex flex-col" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4 px-1">Tasks</h3>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-4 scrollbar-thin">
        {todos.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No tasks yet. Enjoy your day!
          </div>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-default"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id); }}
                  className={`flex-shrink-0 transition-colors ${todo.completed ? 'text-green-500' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
                >
                  {todo.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <span className={`text-sm truncate ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                  {todo.text}
                </span>
              </div>
              
              {/* Right side: Time (default) / Delete (hover) */}
              <div className="pl-2 flex-shrink-0 w-12 flex justify-end">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block group-hover:hidden">
                  {formatTime(todo.createdAt)}
                </span>
                <button 
                  onClick={(e) => deleteTodo(e, todo.id)}
                  className="hidden group-hover:block text-slate-400 hover:text-red-500 transition-all"
                  title="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={addTodo} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="New task..."
          className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-white/50 dark:bg-slate-900/50 border border-white/50 dark:border-white/10 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing
          className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-all active:scale-95"
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
};
