import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sun, Moon } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { ShortcutGrid } from './components/ShortcutGrid';
import { ContextMenu } from './components/ContextMenu';
import { ShortcutModal } from './components/ShortcutModal';
import { Clock } from './components/Clock';
import { AnimatedLogo } from './components/AnimatedLogo';
import { Dock } from './components/Dock';
import { Shortcut, ContextMenuState, ModalState } from './types';

/**
 * Safely save to localStorage with quota management
 * Automatically removes oldest custom icons when storage is full
 */
const saveToLocalStorage = (key: string, data: Shortcut[]): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    // Detect quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota insufficient, attempting to auto-clean custom icons...');

      // Find all shortcuts with custom icons, sorted by time (assuming smaller ID = older)
      const customIconShortcuts = data.filter(s => s.customIcon);

      if (customIconShortcuts.length === 0) {
        // No custom icons to clean, cannot resolve quota issue
        alert('Storage quota exceeded! Please delete some shortcuts or clear browser cache.');
        return false;
      }

      // Remove the oldest custom icon (keep the shortcut itself)
      const oldestCustomIcon = customIconShortcuts[0];
      const cleanedData = data.map(s =>
        s.id === oldestCustomIcon.id ? { ...s, customIcon: undefined } : s
      );

      // Display friendly notification
      const message = `Storage quota exceeded. Automatically removed custom icon for "${oldestCustomIcon.title}".\nThe default website icon will be used instead.`;
      console.warn(message);

      // Delay alert to avoid blocking UI
      setTimeout(() => alert(message), 100);

      // Recursive retry
      return saveToLocalStorage(key, cleanedData);
    }

    // Other errors
    console.error('localStorage save failed:', error);
    return false;
  }
};

// Default shortcuts for first-time users
const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: '1', title: 'ChatGPT', url: 'https://chat.openai.com' },
  { id: '2', title: 'Gemini', url: 'https://gemini.google.com' },
  { id: '3', title: 'GitHub', url: 'https://github.com' },
  { id: '4', title: 'X', url: 'https://x.com' },
  { id: '5', title: 'BiliBili', url: 'https://bilibili.com' },
];

const App: React.FC = () => {
  // --- Random Background Orb Themes ---
  const backgroundOrbs = React.useMemo(() => {
    const randomPosition = () => ({
      top: Math.random() > 0.5 ? `${Math.random() * 30 - 10}%` : 'auto',
      bottom: Math.random() > 0.5 ? `${Math.random() * 30 - 10}%` : 'auto',
      left: Math.random() > 0.5 ? `${Math.random() * 40 - 10}%` : 'auto',
      right: Math.random() > 0.5 ? `${Math.random() * 40 - 10}%` : 'auto',
    });

    // Define multiple color theme groups
    const orbThemes = [
      // Theme 1: Purple Dream (原版靛蓝紫色系)
      [
        { color: 'bg-indigo-200/40 dark:bg-indigo-900/20', blur: 'blur-[120px]' },
        { color: 'bg-pink-200/40 dark:bg-purple-900/20', blur: 'blur-[100px]' },
        { color: 'bg-blue-100/50 dark:bg-slate-900/40', blur: 'blur-[130px]' },
      ],
      // Theme 2: Ocean Breeze (海洋蓝绿色系)
      [
        { color: 'bg-cyan-200/40 dark:bg-cyan-900/20', blur: 'blur-[110px]' },
        { color: 'bg-teal-200/40 dark:bg-teal-900/20', blur: 'blur-[120px]' },
        { color: 'bg-blue-200/50 dark:bg-blue-900/30', blur: 'blur-[130px]' },
        { color: 'bg-sky-100/40 dark:bg-sky-950/20', blur: 'blur-[100px]' },
      ],
      // Theme 3: Sunset Glow (日落橙红色系)
      [
        { color: 'bg-orange-200/40 dark:bg-orange-900/20', blur: 'blur-[115px]' },
        { color: 'bg-rose-200/40 dark:bg-rose-900/20', blur: 'blur-[125px]' },
        { color: 'bg-amber-100/50 dark:bg-amber-950/25', blur: 'blur-[120px]' },
      ],
      // Theme 4: Forest Whisper (森林绿色系)
      [
        { color: 'bg-emerald-200/40 dark:bg-emerald-900/20', blur: 'blur-[120px]' },
        { color: 'bg-lime-200/40 dark:bg-lime-950/20', blur: 'blur-[110px]' },
        { color: 'bg-green-100/50 dark:bg-green-950/30', blur: 'blur-[130px]' },
        { color: 'bg-teal-100/40 dark:bg-teal-950/20', blur: 'blur-[100px]' },
      ],
      // Theme 5: Candy Pop (糖果粉色系)
      [
        { color: 'bg-pink-300/40 dark:bg-pink-900/20', blur: 'blur-[125px]' },
        { color: 'bg-fuchsia-200/40 dark:bg-fuchsia-900/20', blur: 'blur-[115px]' },
        { color: 'bg-purple-200/50 dark:bg-purple-950/25', blur: 'blur-[120px]' },
      ],
      // Theme 6: Midnight Aurora (极光紫蓝色系)
      [
        { color: 'bg-violet-200/40 dark:bg-violet-900/20', blur: 'blur-[120px]' },
        { color: 'bg-indigo-300/40 dark:bg-indigo-950/25', blur: 'blur-[130px]' },
        { color: 'bg-purple-100/50 dark:bg-purple-950/30', blur: 'blur-[110px]' },
        { color: 'bg-blue-200/40 dark:bg-blue-950/20', blur: 'blur-[115px]' },
      ],
    ];

    // Randomly select a theme
    const selectedTheme = orbThemes[Math.floor(Math.random() * orbThemes.length)];

    // Animation variants
    const animations = ['animate-float-1', 'animate-float-2', 'animate-float-3'];

    // Generate orbs with random positions and sizes
    return selectedTheme.map((orb, index) => ({
      ...randomPosition(),
      size: `${35 + Math.random() * 30}%`, // 35-65%
      color: orb.color,
      blur: orb.blur,
      animation: animations[index % animations.length],
    }));
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- State Management ---
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(() => {
    const saved = localStorage.getItem('nexus_shortcuts');
    return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('nexus_theme');
    if (savedTheme) return savedTheme as 'light' | 'dark';
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    shortcutId: null,
  });

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
  });

  // --- Persistence & Theme Effect ---
  useEffect(() => {
    // Use safe save function with automatic quota handling
    const success = saveToLocalStorage('nexus_shortcuts', shortcuts);

    // If save fails after auto-cleanup, update state with cleaned data
    if (!success) {
      // Re-read localStorage to get cleaned data
      const saved = localStorage.getItem('nexus_shortcuts');
      if (saved) {
        const cleanedShortcuts = JSON.parse(saved);
        // Only update state if data actually changed to avoid infinite loop
        if (JSON.stringify(cleanedShortcuts) !== JSON.stringify(shortcuts)) {
          setShortcuts(cleanedShortcuts);
        }
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  // --- Handlers ---
  const handleContextMenu = (e: React.MouseEvent, shortcutId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      shortcutId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const openAddModal = () => {
    closeContextMenu();
    setModal({ isOpen: true, type: 'add' });
  };

  const openEditModal = () => {
    closeContextMenu();
    if (contextMenu.shortcutId) {
      setModal({ isOpen: true, type: 'edit', shortcutId: contextMenu.shortcutId });
    }
  };

  const deleteShortcut = () => {
    closeContextMenu();
    if (contextMenu.shortcutId) {
      setShortcuts(prev => prev.filter(s => s.id !== contextMenu.shortcutId));
    }
  };

  const handleSaveShortcut = (title: string, url: string, customIcon?: string) => {
    if (modal.type === 'add') {
      const newShortcut: Shortcut = {
        id: uuidv4(),
        title,
        url,
        ...(customIcon && { customIcon }), // 只在有 customIcon 时添加
      };
      setShortcuts(prev => [...prev, newShortcut]);
    } else if (modal.type === 'edit' && modal.shortcutId) {
      setShortcuts(prev => prev.map(s =>
        s.id === modal.shortcutId ? { ...s, title, url, customIcon } : s
      ));
    }
    setModal({ isOpen: false, type: null });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Close context menu on window resize
  useEffect(() => {
    const handleResize = () => closeContextMenu();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    // Background Wrapper
    <div 
      className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans select-none transition-colors duration-500"
      onContextMenu={(e) => {
          // Allow native context menu on inputs and text areas
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
          }
          
          // Trigger custom menu for background
          handleContextMenu(e, null);
      }}
      onClick={closeContextMenu}
    >
      {/* Ambient Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {backgroundOrbs.map((orb, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${orb.color} ${orb.blur} ${orb.animation} transition-colors duration-1000`}
            style={{
              top: orb.top,
              bottom: orb.bottom,
              left: orb.left,
              right: orb.right,
              width: orb.size,
              height: orb.size,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center pt-24 px-4 sm:px-8">
        
        {/* Logo Area */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <AnimatedLogo />
            <p className="text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-xs font-bold transition-colors duration-500">
              Personal Dashboard
            </p>
            <Clock />
        </div>

        {/* Search */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <SearchBar />
        </div>

        {/* Grid */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <ShortcutGrid 
            shortcuts={shortcuts} 
            onContextMenu={handleContextMenu}
          />
        </div>
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full text-slate-500 dark:text-slate-400 transition-all duration-300 outline-none"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>

      {/* Bottom Left Dock */}
      <Dock />

      {/* Overlays */}
      <ContextMenu 
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        isShortcutTarget={!!contextMenu.shortcutId}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={deleteShortcut}
        onClose={closeContextMenu}
      />

      <ShortcutModal 
        isOpen={modal.isOpen}
        type={modal.type}
        initialData={shortcuts.find(s => s.id === modal.shortcutId)}
        onClose={() => setModal({ isOpen: false, type: null })}
        onSave={handleSaveShortcut}
      />
    </div>
  );
};

export default App;