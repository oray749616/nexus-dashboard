
import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind } from 'lucide-react';

export interface WeatherData {
  temperature: number;
  weathercode: number;
  city: string;
}

interface WeatherWidgetProps {
  weather: WeatherData | null;
  loading: boolean;
  error: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, loading, error }) => {
  
  const getWeatherIcon = (code: number) => {
    const size = 56;
    const className = "text-indigo-500 dark:text-indigo-400 drop-shadow-sm"; 

    if (code === 0 || code === 1) return <Sun size={size} className={className} />;
    if (code === 2 || code === 3) return <Cloud size={size} className="text-slate-400 dark:text-slate-500" />;
    if ([45, 48].includes(code)) return <Wind size={size} className="text-slate-400 dark:text-slate-500" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={size} className="text-blue-500" />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow size={size} className="text-sky-300" />;
    if ([95, 96, 99].includes(code)) return <CloudLightning size={size} className="text-purple-500" />;
    return <Sun size={size} className={className} />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Sunny';
    if (code === 1) return 'Mainly Sunny';
    if (code === 2) return 'Partly Cloudy';
    if (code === 3) return 'Overcast';
    if ([45, 48].includes(code)) return 'Foggy';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Rainy';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowy';
    if ([95, 96, 99].includes(code)) return 'Stormy';
    return 'Sunny';
  };

  if (loading) {
    return (
      <div className="w-64 p-4 flex items-center justify-between">
        <div className="flex flex-col gap-3 w-full">
             <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
             <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
             <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="w-64 h-32 flex flex-col items-center justify-center text-slate-500">
        <Cloud size={32} className="mb-2 opacity-50" />
        <span className="text-sm">Weather unavailable</span>
      </div>
    );
  }

  return (
    <div className="w-64 flex items-center justify-between p-2">
      <div className="flex flex-col items-start">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-[0.15em] uppercase mb-1">
          {weather.city}
        </div>
        <div className="text-5xl font-bold text-slate-700 dark:text-slate-200 tracking-tighter leading-none mb-1">
          {Math.round(weather.temperature)}°
        </div>
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {getWeatherDescription(weather.weathercode)}
        </div>
      </div>
      <div className="flex items-center justify-center pl-4 pb-2">
        {getWeatherIcon(weather.weathercode)}
      </div>
    </div>
  );
};
