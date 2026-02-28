import React from 'react';
import { useWeather } from '@/hooks/use-queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Wind, Droplets } from 'lucide-react';

export const WeatherWidget = () => {
  const { data: weather, isLoading } = useWeather();

  if (isLoading) return <div className="h-32 bg-zinc-900/50 animate-pulse rounded-lg" />;

  return (
    <Card className="border-zinc-800 bg-zinc-950/50">
      <CardHeader className="pb-2">
        <CardTitle>Regional Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weather?.map((w) => (
            <div key={w.location} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-zinc-900">
                  <Cloud className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <div className="font-medium text-sm text-zinc-200">{w.location}</div>
                  <div className="text-xs text-zinc-500">{w.condition}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg text-zinc-200">{w.temp}°F</div>
                <div className="flex items-center justify-end gap-1 text-xs text-zinc-500">
                  <Wind className="w-3 h-3" />
                  <span>{w.windSpeed}mph {w.windDir}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
