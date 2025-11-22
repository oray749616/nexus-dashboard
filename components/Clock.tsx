import React, { useState, useEffect } from 'react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="text-center mt-6 animate-in fade-in duration-700 delay-150">
      <div className="text-4xl md:text-5xl lg:text-6xl text-slate-800 dark:text-white tracking-wide drop-shadow-sm transition-colors duration-500 tabular-nums">
        {formatTime(time)}
      </div>
    </div>
  );
};
