import React from 'react';
import { useSummary } from '@/hooks/use-queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const AISummary = () => {
  const { data: summary, isLoading } = useSummary();

  if (isLoading) return <div className="h-32 bg-zinc-900/50 animate-pulse rounded-lg" />;

  return (
    <Card className="border-zinc-800 bg-zinc-950/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Bot className="w-24 h-24 text-sky-500" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sky-400">
          <Sparkles className="w-4 h-4" />
          <span>AI Situation Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-zinc-300 font-medium">
          {summary?.text}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
          <span>Source: Gemini 2.5 Flash • Verify with primary sources</span>
          {summary?.lastUpdated && (
            <span>Updated {formatDistanceToNow(new Date(summary.lastUpdated))} ago</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
