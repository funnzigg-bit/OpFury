import React from 'react';
import { useNews } from '@/hooks/use-queries';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';

export const NewsFeed = () => {
  const { data: news, isLoading } = useNews();

  if (isLoading) return <div className="p-4 text-zinc-500">Loading news...</div>;

  return (
    <Card className="h-full flex flex-col border-zinc-800 bg-zinc-950/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Latest Media Reports</span>
          <Badge variant="outline" className="text-xs font-normal">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
        <div className="divide-y divide-zinc-800">
          {news?.map((item) => (
            <div key={item.id} className="p-4 hover:bg-zinc-900/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <Badge 
                  variant={item.category === 'strikes' ? 'destructive' : 'secondary'}
                  className="text-[10px] uppercase tracking-wider px-1.5 py-0 h-5"
                >
                  {item.category}
                </Badge>
                <span className="text-xs text-zinc-500 font-mono">
                  {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                </span>
              </div>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group"
              >
                <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white leading-snug mb-1">
                  {item.title}
                </h4>
                <div className="flex items-center text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-400">{item.source}</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
