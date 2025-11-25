'use client'

import React, { useEffect, useState } from 'react';
import { AppSettings } from '@/lib/types';
import { LogoSettings } from './LogoSettings';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

/**
 * Settings drawer component
 * Slides in from right, closes on overlay click
 */
export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  // Control component rendering
  const [shouldRender, setShouldRender] = useState(false);
  // Control animation state: true = shown, false = hidden
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle open/close
  useEffect(() => {
    if (isOpen) {
      // Open: render component first, then trigger animation on next frame
      setShouldRender(true);
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      // Close: trigger close animation first
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Handle transition end
  const handleTransitionEnd = () => {
    if (!isAnimating && !isOpen) {
      // Stop rendering after close animation ends
      setShouldRender(false);
    }
  };

  // Handle close
  const handleClose = () => {
    onClose();
  };

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Don't render if not needed
  if (!shouldRender) return null;

  const handleLogoChange = (logoSettings: AppSettings['logo']) => {
    onSettingsChange({ ...settings, logo: logoSettings });
  };

  return (
    <>
      {/* Overlay - click to close */}
      <div
        className={`
          fixed inset-0 z-50 bg-black/25 dark:bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={handleClose}
      />

      {/* Drawer panel */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-80 sm:w-96
          bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl
          border-l border-white/40 dark:border-white/10
          shadow-2xl
          transition-transform duration-300 ease-out
          ${isAnimating ? 'translate-x-0' : 'translate-x-full'}
        `}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Header - no close button */}
        <div className="p-6 border-b border-white/20 dark:border-white/5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Settings
          </h2>
        </div>

        {/* Content area */}
        <div className="p-6 space-y-8 overflow-y-auto h-[calc(100%-80px)]">
          <LogoSettings
            settings={settings.logo}
            onChange={handleLogoChange}
          />
        </div>
      </div>
    </>
  );
};
