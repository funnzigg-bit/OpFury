import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WorldClock } from '@/components/dashboard/WorldClock';
import { NewsFeed } from '@/components/dashboard/NewsFeed';
import { SocialFeed } from '@/components/dashboard/SocialFeed';
import { MapWidget } from '@/components/dashboard/MapWidget';
import { WebcamGrid } from '@/components/dashboard/WebcamGrid';
import { MarketWidget } from '@/components/dashboard/MarketWidget';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { AISummary } from '@/components/dashboard/AISummary';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Activity, Radio, Key } from 'lucide-react';

const queryClient = new QueryClient();

// Helper for AI Studio Key Selection
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

function Dashboard() {
  const { activeTab, setActiveTab } = useDashboardStore();
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
      // Force reload to ensure backend picks up the key if injected
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-900 selection:text-white">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            <h1 className="text-sm md:text-lg font-bold tracking-tight text-white truncate max-w-[200px] md:max-w-none">
              GLOBAL CONFLICT MONITOR <span className="text-red-600">LIVE</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {!hasKey && (
              <button 
                onClick={handleConnectKey}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded animate-pulse"
              >
                <Key className="w-3 h-3" />
                CONNECT API KEY
              </button>
            )}
            <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1 text-emerald-500">
                <Activity className="w-3 h-3" />
                SYSTEM OPTIMAL
              </span>
              <span className="w-px h-3 bg-zinc-800"></span>
              <span className="flex items-center gap-1 text-red-500 animate-pulse">
                <Radio className="w-3 h-3" />
                DEFCON 3
              </span>
            </div>
          </div>
        </div>
        <WorldClock />
      </header>

      {/* Main Content */}
      <main className="p-2 md:p-4 lg:h-[calc(100vh-7rem)] overflow-y-auto lg:overflow-hidden">
        <Tabs className="h-full flex flex-col">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
             <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  OVERVIEW
                </button>
                <button 
                  onClick={() => setActiveTab('intel')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${activeTab === 'intel' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  INTEL FEED
                </button>
             </div>
             <div className="text-[10px] text-zinc-600 font-mono hidden md:block">
               LAST UPDATE: {new Date().toLocaleTimeString()}
             </div>
          </div>

          <div className="flex-1 lg:overflow-hidden">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-full">
                {/* Left Column: News & Intel */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto">
                  <div className="flex-1 min-h-[400px]">
                    <NewsFeed />
                  </div>
                </div>

                {/* Center Column: Map & Visuals */}
                <div className="lg:col-span-6 flex flex-col gap-4 h-full overflow-y-auto">
                  <div className="shrink-0">
                    <AISummary />
                  </div>
                  <div className="h-[400px] shrink-0">
                    <MapWidget />
                  </div>
                  <div className="shrink-0">
                    <WebcamGrid />
                  </div>
                </div>

                {/* Right Column: Social & Data */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-y-auto">
                  <div className="flex-1 min-h-[400px]">
                    <SocialFeed />
                  </div>
                  <div className="shrink-0">
                    <MarketWidget />
                  </div>
                  <div className="shrink-0">
                    <WeatherWidget />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'intel' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full min-h-[800px] lg:min-h-0">
                <NewsFeed />
                <SocialFeed />
              </div>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
