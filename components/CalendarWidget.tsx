import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const blanks = Array(startDay).fill(null);
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

    return [...blanks, ...daysArray].map((day, index) => {
      if (day === null) return <div key={`blank-${index}`} />;
      
      const isToday = isCurrentMonth && day === today.getDate();
      
      return (
        <div 
          key={day} 
          className={`
            h-8 w-8 flex items-center justify-center text-sm rounded-full transition-colors
            ${isToday 
              ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/30' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10'
            }
          `}
        >
          {day}
        </div>
      );
    });
  };

  return (
    <div className="w-80 p-1">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {days.map(d => (
          <div key={d} className="text-xs font-bold text-slate-400 dark:text-slate-500 h-8 flex items-center justify-center">
            {d}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};