import React from 'react';
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
import { Activity, Radio } from 'lucide-react';

const queryClient = new QueryClient();

function Dashboard() {
  const { activeTab, setActiveTab } = useDashboardStore();

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-900 selection:text-white">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              OPFURY<span className="text-red-600">LIVE</span>
            </h1>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800 ml-2">
              OP. EPIC FURY
            </span>
          </div>
          
          <div className="flex items-center gap-4">
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
      <main className="p-2 md:p-4 md:h-[calc(100vh-7rem)] overflow-y-auto md:overflow-hidden">
        <Tabs className="h-full flex flex-col">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
             <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${activeTab === 'overview' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  OVERVIEW
                </button>
                <button 
                  onClick={() => setActiveTab('intel')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${activeTab === 'intel' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  INTEL FEED
                </button>
             </div>
             <div className="text-[10px] text-zinc-600 font-mono">
               LAST UPDATE: {new Date().toLocaleTimeString()}
             </div>
          </div>

          <div className="flex-1 md:overflow-hidden">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-full">
                {/* Left Column: News & Intel */}
                <div className="md:col-span-3 flex flex-col gap-4 h-full overflow-y-auto">
                  <div className="flex-1 min-h-[400px]">
                    <NewsFeed />
                  </div>
                </div>

                {/* Center Column: Map & Visuals */}
                <div className="md:col-span-6 flex flex-col gap-4 h-full overflow-y-auto">
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
                <div className="md:col-span-3 flex flex-col gap-4 h-full overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[800px]">
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
