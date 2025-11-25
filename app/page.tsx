'use client'

import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Sun, Moon } from 'lucide-react'
import { SearchBar } from '@/components/ui/SearchBar'
import { Clock } from '@/components/ui/Clock'
import { AnimatedLogo } from '@/components/ui/AnimatedLogo'
import { ContextMenu } from '@/components/ui/ContextMenu'
import { ShortcutGrid } from '@/components/shortcut/ShortcutGrid'
import { ShortcutModal } from '@/components/modals/ShortcutModal'
import { Dock } from '@/components/layout/Dock'
import { Shortcut, ContextMenuState, ModalState, BackgroundOrb } from '@/lib/types'
import { saveToLocalStorage, generateBackgroundOrbs } from '@/lib/utils'
import { DEFAULT_SHORTCUTS, ORB_THEMES, BACKGROUND_ANIMATIONS } from '@/lib/constants'

export default function Home() {
  // --- State Management ---
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(DEFAULT_SHORTCUTS)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isClient, setIsClient] = useState(false)

  // --- Random Background Orb Themes (Client-side only) ---
  const [backgroundOrbs, setBackgroundOrbs] = useState<BackgroundOrb[]>([])

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    shortcutId: null,
  })

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
  })

  // --- Dock Visibility State ---
  const [dockVisible, setDockVisible] = useState(false)

  // --- Initialize from localStorage (client-side only) ---
  useEffect(() => {
    setIsClient(true)

    // 生成随机背景光球（仅客户端，避免水合不匹配）
    const generatedOrbs = generateBackgroundOrbs(ORB_THEMES, BACKGROUND_ANIMATIONS)
    setBackgroundOrbs(generatedOrbs)

    // Load shortcuts from localStorage
    const savedShortcuts = localStorage.getItem('nexus_shortcuts')
    if (savedShortcuts) {
      setShortcuts(JSON.parse(savedShortcuts))
    }

    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('nexus_theme')
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark')
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  // --- Persistence & Theme Effect ---
  useEffect(() => {
    if (!isClient) return

    // Use safe save function with automatic quota handling
    const success = saveToLocalStorage('nexus_shortcuts', shortcuts)

    // If save fails after auto-cleanup, update state with cleaned data
    if (!success) {
      // Re-read localStorage to get cleaned data
      const saved = localStorage.getItem('nexus_shortcuts')
      if (saved) {
        const cleanedShortcuts = JSON.parse(saved)
        // Only update state if data actually changed to avoid infinite loop
        if (JSON.stringify(cleanedShortcuts) !== JSON.stringify(shortcuts)) {
          setShortcuts(cleanedShortcuts)
        }
      }
    }
  }, [shortcuts, isClient])

  useEffect(() => {
    if (!isClient) return

    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('nexus_theme', theme)
  }, [theme, isClient])

  // --- Handlers ---
  const handleContextMenu = (e: React.MouseEvent, shortcutId: string | null) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      shortcutId,
    })
  }

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }))
  }

  const openAddModal = () => {
    closeContextMenu()
    setModal({ isOpen: true, type: 'add' })
  }

  const openEditModal = () => {
    closeContextMenu()
    if (contextMenu.shortcutId) {
      setModal({ isOpen: true, type: 'edit', shortcutId: contextMenu.shortcutId })
    }
  }

  const deleteShortcut = () => {
    closeContextMenu()
    if (contextMenu.shortcutId) {
      setShortcuts(prev => prev.filter(s => s.id !== contextMenu.shortcutId))
    }
  }

  const handleSaveShortcut = (title: string, url: string, customIcon?: string) => {
    if (modal.type === 'add') {
      const newShortcut: Shortcut = {
        id: uuidv4(),
        title,
        url,
        ...(customIcon && { customIcon }), // 只在有 customIcon 时添加
      }
      setShortcuts(prev => [...prev, newShortcut])
    } else if (modal.type === 'edit' && modal.shortcutId) {
      setShortcuts(prev => prev.map(s =>
        s.id === modal.shortcutId ? { ...s, title, url, customIcon } : s
      ))
    }
    setModal({ isOpen: false, type: null })
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Close context menu on window resize
  useEffect(() => {
    const handleResize = () => closeContextMenu()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    // Background Wrapper
    <div
      className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans select-none transition-colors duration-500"
      onContextMenu={(e) => {
        // Allow native context menu on inputs and text areas
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return
        }

        // Trigger custom menu for background
        handleContextMenu(e, null)
      }}
      onClick={() => {
        closeContextMenu()
        setDockVisible(false)
      }}
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

      {/* Bottom Center Toolbar Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setDockVisible(true)
        }}
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-30
          text-sm font-medium text-slate-500 dark:text-slate-400
          hover:text-slate-700 dark:hover:text-slate-200
          transition-all duration-300 ease-out
          ${dockVisible ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}
        `}
      >
        Toolbar
      </button>

      {/* Bottom Center Dock */}
      <Dock visible={dockVisible} />

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
  )
}
