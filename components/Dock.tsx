import React, { useState, useRef, useEffect } from 'react';
import { Cloud, Calendar, ListTodo, StickyNote } from 'lucide-react';
import { WeatherWidget, WeatherData } from './WeatherWidget';
import { CalendarWidget } from './CalendarWidget';
import { TodoWidget } from './TodoWidget';
import { QuickNotesWidget } from './QuickNotesWidget';

type ActiveWidget = 'weather' | 'calendar' | 'todo' | 'notes' | null;

export const Dock: React.FC = () => {
  const [activeWidget, setActiveWidget] = useState<ActiveWidget>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // Weather State (Silent Loading)
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  // Load weather on mount
  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number, cityName: string = 'Local') => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();
        setWeather({
          temperature: data.current_weather.temperature,
          weathercode: data.current_weather.weathercode,
          city: cityName
        });
        setWeatherLoading(false);
      } catch (err) {
        console.error("Failed to fetch weather", err);
        setWeatherError(true);
        setWeatherLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, 'Local');
        },
        () => {
          // Default to Beijing
          fetchWeather(39.9042, 116.4074, 'Beijing');
        }
      );
    } else {
       fetchWeather(39.9042, 116.4074, 'Beijing');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveWidget(null);
      }
    };
    
    if (activeWidget) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeWidget]);

  // Update pill position based on active element
  useEffect(() => {
    const activeIndex = tabs.findIndex(t => t.id === activeWidget);
    const el = tabsRef.current[activeIndex];

    if (activeWidget && el) {
      setPillStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1
      });
    } else {
      // Fade out at current location
      setPillStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeWidget]);

  const toggleWidget = (widget: ActiveWidget) => {
    setActiveWidget(prev => prev === widget ? null : widget);
  };

  const renderWidgetContent = () => {
    switch (activeWidget) {
      case 'weather': return <WeatherWidget weather={weather} loading={weatherLoading} error={weatherError} />;
      case 'calendar': return <CalendarWidget />;
      case 'todo': return <TodoWidget />;
      case 'notes': return <QuickNotesWidget />;
      default: return null;
    }
  };

  // Dock Tabs Configuration
  const tabs = [
    { id: 'weather', icon: <Cloud size={20} />, label: 'Weather' },
    { id: 'calendar', icon: <Calendar size={20} />, label: 'Calendar' },
    { id: 'todo', icon: <ListTodo size={20} />, label: 'Todo' },
    { id: 'notes', icon: <StickyNote size={20} />, label: 'Quick Notes' },
  ];

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-4">
        {/* Widget Popup */}
        <div className={`
            origin-bottom-left transition-all duration-300 ease-out mb-2
            ${activeWidget ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
        `}>
            {activeWidget && (
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 dark:border-white/10 p-4">
                    {renderWidgetContent()}
                </div>
            )}
        </div>

        {/* Dock Icons */}
        <div className="relative flex items-center gap-1 p-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-white/5 shadow-glass">
            
            {/* Animated Sliding Background */}
            <div 
                className="absolute top-2 bottom-2 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/30 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) z-0"
                style={{
                    left: `${pillStyle.left}px`,
                    width: `${pillStyle.width}px`,
                    opacity: pillStyle.opacity
                }}
            />

            {tabs.map((tab, index) => (
                <button
                    key={tab.id}
                    ref={el => { tabsRef.current[index] = el }}
                    onClick={() => toggleWidget(tab.id as ActiveWidget)}
                    className={`
                        relative z-10 w-11 h-11 flex items-center justify-center rounded-xl transition-colors duration-300 group
                        ${activeWidget === tab.id ? 'text-white' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300'}
                    `}
                    title={tab.label}
                >
                    {tab.icon}
                     {/* Label Tooltip */}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {tab.label}
                        <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800 dark:border-t-white"></span>
                    </span>
                </button>
            ))}
        </div>
    </div>
  );
};