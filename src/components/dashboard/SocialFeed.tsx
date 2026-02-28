import React from 'react';
import { useTweets } from '@/hooks/use-queries';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Twitter, Repeat, Heart, PlayCircle } from 'lucide-react';

export const SocialFeed = () => {
  const { data: tweets, isLoading, error } = useTweets();

  if (isLoading) return (
    <Card className="h-full flex flex-col border-zinc-800 bg-zinc-950/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Twitter className="w-4 h-4 text-sky-500" />
          <span>X (Twitter) Intel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-zinc-500 text-sm">
        Loading feed...
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card className="h-full flex flex-col border-zinc-800 bg-zinc-950/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Twitter className="w-4 h-4 text-sky-500" />
          <span>X (Twitter) Intel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-red-500 text-sm">
        Failed to load feed.
      </CardContent>
    </Card>
  );

  return (
    <Card className="h-full flex flex-col border-zinc-800 bg-zinc-950/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-sky-500" />
            <span>X (Twitter) Intel</span>
          </div>
          <Badge variant="outline" className="text-xs font-normal animate-pulse">Live Feed</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
        <div className="divide-y divide-zinc-800">
          {tweets && tweets.length > 0 ? (
            tweets.map((tweet) => (
            <div key={tweet.id} className="p-4 hover:bg-zinc-900/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-h-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-sm text-zinc-200">{tweet.author}</span>
                      <span className="text-xs text-zinc-500 truncate">{tweet.handle}</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(tweet.time), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap mb-2 leading-relaxed">
                    {tweet.content}
                  </p>
                  
                  {/* Media Attachment */}
                  {tweet.media && (
                    <div className="mb-3 mt-2 rounded-lg overflow-hidden border border-zinc-800 relative group cursor-pointer">
                      <img 
                        src={tweet.media.thumbnailUrl} 
                        alt="Tweet media" 
                        className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                      {tweet.media.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-sky-500/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
                            <PlayCircle className="w-6 h-6 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Repeat className="w-3 h-3" />
                      <span>{tweet.retweets}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{tweet.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="p-4 text-zinc-500 text-sm text-center">
              No tweets available.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
