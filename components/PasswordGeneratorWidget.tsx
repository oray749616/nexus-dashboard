'use client'

import React, { useState, useEffect } from 'react';
import { Key, Copy, RefreshCw, Check } from 'lucide-react';

type PasswordType = 'random' | 'pin';

interface PasswordSettings {
  type: PasswordType;
  randomLength: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  pinLength: number;
}

const DEFAULT_SETTINGS: PasswordSettings = {
  type: 'random',
  randomLength: 8,
  includeNumbers: false,
  includeSymbols: false,
  pinLength: 6,
};

export const PasswordGeneratorWidget: React.FC = () => {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState<PasswordSettings>(DEFAULT_SETTINGS);
  const [isClient, setIsClient] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('nexus_password_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (e) {
        console.error('Failed to parse password settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('nexus_password_settings', JSON.stringify(settings));
    }
  }, [settings, isClient]);

  // Generate password
  const generatePassword = () => {
    if (settings.type === 'random') {
      const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '01234567890123456789';
      const symbols = '!@#$%&*-_+=?';  // Common password symbols

      let charset = letters;
      if (settings.includeNumbers) charset += numbers;
      if (settings.includeSymbols) charset += symbols;

      const array = new Uint8Array(settings.randomLength);
      crypto.getRandomValues(array);

      const generated = Array.from(array)
        .map(x => charset[x % charset.length])
        .join('');

      setPassword(generated);
    } else {
      // PIN mode: generate digits only
      const array = new Uint8Array(settings.pinLength);
      crypto.getRandomValues(array);

      const generated = Array.from(array)
        .map(x => (x % 10).toString())
        .join('');

      setPassword(generated);
    }
  };

  // Generate initial password
  useEffect(() => {
    if (isClient) {
      generatePassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  // Auto-regenerate password when settings change
  useEffect(() => {
    if (isClient && password) {
      generatePassword();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.randomLength, settings.includeNumbers, settings.includeSymbols, settings.pinLength, settings.type]);

  // Copy to clipboard
  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Manual refresh
  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    generatePassword();
    setTimeout(() => setIsRotating(false), 600);
  };

  // Switch type
  const handleTypeChange = (type: PasswordType) => {
    setSettings({ ...settings, type });
  };

  // Update length (Random mode)
  const handleRandomLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, randomLength: parseInt(e.target.value) });
  };

  // Update length (PIN mode)
  const handlePinLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, pinLength: parseInt(e.target.value) });
  };

  // Toggle switches
  const toggleNumbers = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSettings({ ...settings, includeNumbers: !settings.includeNumbers });
  };

  const toggleSymbols = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSettings({ ...settings, includeSymbols: !settings.includeSymbols });
  };

  // Render colored password
  const renderColoredPassword = () => {
    if (!password) return <span className="text-slate-400">Generating...</span>;

    return password.split('').map((char, index) => {
      const isNumber = /[0-9]/.test(char);
      const isSymbol = /[!@#$%&*\-_+=?]/.test(char);

      let colorClass = 'text-slate-800 dark:text-slate-200'; // Default color for letters
      if (isNumber) {
        colorClass = 'text-indigo-500'; // Use button color for numbers
      } else if (isSymbol) {
        colorClass = 'text-red-500'; // Use red for symbols
      }

      return (
        <span key={index} className={colorClass}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-96 p-1 transition-all duration-300 ease-in-out" onClick={(e) => e.stopPropagation()}>
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <Key size={18} className="text-indigo-500" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
          Password Generator
        </h3>
      </div>

      {/* 类型切换 */}
      <div className="flex gap-2 mb-4 px-1">
        <button
          onClick={(e) => { e.stopPropagation(); handleTypeChange('random'); }}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 ${
            settings.type === 'random'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
              : 'bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-white/20'
          }`}
        >
          Random
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleTypeChange('pin'); }}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 ${
            settings.type === 'pin'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
              : 'bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-white/20'
          }`}
        >
          PIN
        </button>
      </div>

      {/* 密码显示框 */}
      <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-lg text-center tracking-wide break-all select-all font-semibold">
        {renderColoredPassword()}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2 mb-4 px-1">
        <button
          onClick={handleRefresh}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors duration-300 font-semibold shadow-md shadow-indigo-500/20"
        >
          <RefreshCw size={18} className={`transition-transform duration-500 ${isRotating ? 'rotate-360' : ''}`} style={{ transform: isRotating ? 'rotate(360deg)' : 'rotate(0deg)' }} />
          Generate
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!password}
          className="px-4 py-2.5 rounded-lg bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check size={18} className="text-green-500" />
          ) : (
            <Copy size={18} className="text-slate-600 dark:text-slate-400" />
          )}
        </button>
      </div>

      {/* 长度滑条 */}
      <div className="mb-4 px-1">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Length
          </label>
          <span className="text-sm font-bold text-indigo-500">
            {settings.type === 'random' ? settings.randomLength : settings.pinLength}
          </span>
        </div>
        <input
          type="range"
          min={settings.type === 'random' ? 8 : 3}
          max={settings.type === 'random' ? 64 : 12}
          value={settings.type === 'random' ? settings.randomLength : settings.pinLength}
          onChange={settings.type === 'random' ? handleRandomLengthChange : handlePinLengthChange}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${
              settings.type === 'random'
                ? ((settings.randomLength - 8) / (64 - 8)) * 100
                : ((settings.pinLength - 3) / (12 - 3)) * 100
            }%, rgb(226, 232, 240) ${
              settings.type === 'random'
                ? ((settings.randomLength - 8) / (64 - 8)) * 100
                : ((settings.pinLength - 3) / (12 - 3)) * 100
            }%, rgb(226, 232, 240) 100%)`
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-400">
            {settings.type === 'random' ? '8' : '3'}
          </span>
          <span className="text-xs text-slate-400">
            {settings.type === 'random' ? '64' : '12'}
          </span>
        </div>
      </div>

      {/* Random 模式专属选项 */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          settings.type === 'random' ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-3 px-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Include Numbers
            </span>
            <button
              onClick={toggleNumbers}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                settings.includeNumbers
                  ? 'bg-indigo-500'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  settings.includeNumbers ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Include Symbols
            </span>
            <button
              onClick={toggleSymbols}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                settings.includeSymbols
                  ? 'bg-indigo-500'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  settings.includeSymbols ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
