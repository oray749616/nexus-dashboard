'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { LogoSettings as LogoSettingsType } from '@/lib/types';

interface LogoSettingsProps {
  settings: LogoSettingsType;
  onChange: (settings: LogoSettingsType) => void;
}

/**
 * Logo settings component
 * Contains visibility toggle and dynamic text input list
 */
export const LogoSettings: React.FC<LogoSettingsProps> = ({ settings, onChange }) => {
  // Local text state (for immediate display)
  const [localTexts, setLocalTexts] = useState<string[]>(settings.texts);
  // Debounce timer
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Logo texts area show/hide animation control
  const [shouldRenderTexts, setShouldRenderTexts] = useState(settings.visible);
  const [textsAnimating, setTextsAnimating] = useState(settings.visible);

  // Sync external texts to local state
  useEffect(() => {
    setLocalTexts(settings.texts);
  }, [settings.texts]);

  // Handle logo texts area show/hide animation
  useEffect(() => {
    if (settings.visible) {
      // Show: render first, then trigger animation
      setShouldRenderTexts(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTextsAnimating(true);
        });
      });
    } else {
      // Hide: trigger animation first
      setTextsAnimating(false);
    }
  }, [settings.visible]);

  // Handle transition end
  const handleTextsTransitionEnd = () => {
    if (!textsAnimating && !settings.visible) {
      setShouldRenderTexts(false);
    }
  };

  const handleVisibleChange = (visible: boolean) => {
    onChange({ ...settings, visible });
  };

  // Debounced update to parent
  const debouncedUpdate = useCallback((newTexts: string[]) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onChange({ ...settings, texts: newTexts });
    }, 300);
  }, [onChange, settings]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleTextChange = (index: number, value: string) => {
    const newTexts = [...localTexts];
    newTexts[index] = value;
    setLocalTexts(newTexts); // Update local state immediately
    debouncedUpdate(newTexts); // Debounced update to parent
  };

  const handleAddText = () => {
    const newTexts = [...localTexts, ''];
    setLocalTexts(newTexts);
    onChange({ ...settings, texts: newTexts });
  };

  const handleRemoveText = (index: number) => {
    if (localTexts.length <= 1) return;
    const newTexts = localTexts.filter((_, i) => i !== index);
    setLocalTexts(newTexts);
    onChange({ ...settings, texts: newTexts });
  };

  return (
    <div className="space-y-6">
      {/* Section title */}
      <div>
        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
          Animated Logo
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          Configure the animated logo display
        </p>
      </div>

      {/* Visibility toggle */}
      <Toggle
        label="Show Logo"
        checked={settings.visible}
        onChange={handleVisibleChange}
      />

      {/* Text configuration - with transition animation */}
      {shouldRenderTexts && (
        <div
          className={`
            space-y-3 overflow-hidden
            transition-all duration-300 ease-out
            ${textsAnimating ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'}
          `}
          onTransitionEnd={handleTextsTransitionEnd}
        >
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Logo Texts
          </label>

          {localTexts.map((text, index) => (
            <div key={index} className="flex items-center gap-2 animate-in fade-in duration-200">
              <input
                type="text"
                value={text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={`Text ${index + 1}`}
                className="flex-1 px-3 py-2 rounded-lg
                           bg-white/50 dark:bg-slate-900/50
                           border border-white/50 dark:border-white/10
                           text-sm text-slate-700 dark:text-slate-200
                           placeholder-slate-400
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                           transition-all duration-200"
              />
              {/* Delete button - only show when more than one item */}
              {localTexts.length > 1 && (
                <button
                  onClick={() => handleRemoveText(index)}
                  className="p-2 rounded-lg text-slate-400
                             hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10
                             transition-colors duration-200"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              )}
              {/* Add button - only show on last item */}
              {index === localTexts.length - 1 && (
                <button
                  onClick={handleAddText}
                  className="p-2 rounded-lg
                             bg-indigo-50 text-indigo-600
                             dark:bg-indigo-500/10 dark:text-indigo-400
                             hover:bg-indigo-100 dark:hover:bg-indigo-500/20
                             transition-colors duration-200"
                  title="Add new text"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
