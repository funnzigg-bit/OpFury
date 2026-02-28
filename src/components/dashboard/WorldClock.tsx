import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Globe } from 'lucide-react';

const TimeDisplay = ({ timezone, label }: { timezone: string, label: string }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center px-4 border-r border-zinc-800 last:border-0">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">{label}</span>
      <span className="text-sm font-mono text-zinc-200">
        {new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(time)}
      </span>
    </div>
  );
};

export const WorldClock = () => {
  return (
    <div className="flex items-center bg-zinc-950 border-b border-zinc-800 py-2 px-4 overflow-x-auto">
      <div className="flex items-center mr-4 text-zinc-500">
        <Globe className="w-4 h-4 mr-2" />
        <span className="text-xs font-bold tracking-widest uppercase hidden sm:inline">Global Time</span>
      </div>
      <div className="flex">
        <TimeDisplay timezone="America/New_York" label="Washington DC" />
        <TimeDisplay timezone="Europe/Brussels" label="Brussels" />
        <TimeDisplay timezone="Asia/Tehran" label="Tehran" />
        <TimeDisplay timezone="Asia/Shanghai" label="Beijing" />
      </div>
    </div>
  );
};
