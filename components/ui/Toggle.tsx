'use client'

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

/**
 * Toggle switch component
 */
export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      {label && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </span>
      )}
      <div
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-7 rounded-md transition-colors duration-200
          ${checked
            ? 'bg-indigo-500'
            : 'bg-slate-200 dark:bg-slate-700'
          }
        `}
      >
        <div
          className={`
            absolute top-0.5 w-6 h-6 bg-white rounded-sm shadow-md
            transition-transform duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0.5'}
          `}
        />
      </div>
    </label>
  );
};
