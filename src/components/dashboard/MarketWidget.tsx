import React from 'react';
import { useMarkets } from '@/hooks/use-queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const MarketWidget = () => {
  const { data: markets, isLoading } = useMarkets();

  if (isLoading) return <div className="h-32 bg-zinc-900/50 animate-pulse rounded-lg" />;

  return (
    <Card className="border-zinc-800 bg-zinc-950/50">
      <CardHeader className="pb-2">
        <CardTitle>Defense & Energy Markets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {markets?.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-sm text-zinc-200">{stock.symbol}</span>
                <span className="text-xs text-zinc-500">Real-time</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-sm text-zinc-200">{formatCurrency(stock.price)}</span>
                <div className={`flex items-center text-xs ${stock.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  <span className="font-mono">
                    {stock.change > 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
