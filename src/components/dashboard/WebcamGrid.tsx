import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WebcamGrid = () => {
  return (
    <Card className="border-zinc-800 bg-zinc-950/50">
      <CardHeader className="pb-2">
        <CardTitle>Live Feeds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/-zGuR1qVKrU?autoplay=1&mute=1" 
              title="Tehran Live" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="opacity-80 group-hover:opacity-100 transition-opacity"
            ></iframe>
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded animate-pulse">LIVE</div>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Tehran Skyline</div>
          </div>
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/6ccj1_fFExY?autoplay=1&mute=1" 
              title="Multi-cam" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="opacity-80 group-hover:opacity-100 transition-opacity"
            ></iframe>
            <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded animate-pulse">LIVE</div>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Regional Multi-View</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
