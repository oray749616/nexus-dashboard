'use client'

import React, { useState, useEffect } from 'react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize time immediately on client
    setTime(new Date());

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date | null): string => {
    if (!date) return '--:--:--';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getGreeting = (date: Date | null): string => {
    if (!date) return '';
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning ~';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon ~';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening ~';
    } else {
      return 'Good Night ~';
    }
  };

  return (
    <div className="text-center mt-6 animate-in fade-in duration-700 delay-150">
      <div className="text-4xl md:text-5xl lg:text-6xl text-slate-800 dark:text-white tracking-wide drop-shadow-sm transition-colors duration-500 tabular-nums">
        {formatTime(time)}
      </div>
      <div className="mt-2 text-lg md:text-xl text-slate-600 dark:text-slate-300 tracking-wide transition-colors duration-500">
        {formatDate(time)}
      </div>
      <div className="mt-1 text-sm md:text-md text-slate-700 dark:text-slate-200 font-medium tracking-wide transition-colors duration-500">
        {getGreeting(time)}
      </div>
    </div>
  );
};
