import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp } from 'lucide-react';

interface CandlestickChartProps {
  pair: string;
}

interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Generate simulated OHLC data for a given pair
function generateCandleData(pair: string, count: number = 30): Candle[] {
  const seed = pair.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = 1.0 + (seed % 50) / 100;
  const candles: Candle[] = [];
  
  let currentPrice = basePrice;
  const now = Date.now();
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * 3600000; // 1 hour intervals
    
    // Generate pseudo-random but deterministic values
    const random1 = Math.sin(seed * i * 0.1) * 0.5 + 0.5;
    const random2 = Math.sin(seed * i * 0.2) * 0.5 + 0.5;
    const random3 = Math.sin(seed * i * 0.3) * 0.5 + 0.5;
    const random4 = Math.sin(seed * i * 0.4) * 0.5 + 0.5;
    
    const volatility = 0.02;
    const open = currentPrice;
    const change = (random1 - 0.5) * volatility * 2;
    const close = open + change;
    
    const high = Math.max(open, close) + random2 * volatility;
    const low = Math.min(open, close) - random3 * volatility;
    
    candles.push({
      timestamp,
      open,
      high,
      low,
      close
    });
    
    currentPrice = close + (random4 - 0.5) * volatility * 0.5;
  }
  
  return candles;
}

// Update the most recent candle with simulated live price movement
function updateLastCandle(candles: Candle[], pair: string): Candle[] {
  if (candles.length === 0) return candles;
  
  const updated = [...candles];
  const lastCandle = updated[updated.length - 1];
  const seed = pair.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const timeFactor = Date.now() / 1000;
  
  // Generate pseudo-random movement
  const random = Math.sin(seed * timeFactor * 0.01) * 0.5 + 0.5;
  const volatility = 0.01;
  const priceChange = (random - 0.5) * volatility;
  
  const newClose = lastCandle.close + priceChange;
  const newHigh = Math.max(lastCandle.high, newClose);
  const newLow = Math.min(lastCandle.low, newClose);
  
  updated[updated.length - 1] = {
    ...lastCandle,
    close: newClose,
    high: newHigh,
    low: newLow
  };
  
  return updated;
}

export default function CandlestickChart({ pair }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  
  // Local state for live-updating candles
  const [candles, setCandles] = useState<Candle[]>([]);

  // Initialize candles when pair changes
  useEffect(() => {
    setIsLoading(true);
    setRenderError(null);
    
    try {
      const initialCandles = generateCandleData(pair);
      setCandles(initialCandles);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating candle data:', error);
      setRenderError('Failed to generate chart data');
      setIsLoading(false);
    }
  }, [pair]);

  // Live updates: update the most recent candle every 3 seconds
  useEffect(() => {
    if (candles.length === 0) return;

    const interval = setInterval(() => {
      setCandles(prevCandles => updateLastCandle(prevCandles, pair));
    }, 3000);

    return () => clearInterval(interval);
  }, [candles.length, pair]);

  // Measure container width on mount and resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Show loading skeleton while measuring or loading data
  if (isLoading || containerWidth === 0) {
    return (
      <Card className="border-border/50 shadow-premium">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Price Chart</CardTitle>
          </div>
          <CardDescription>{pair}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[400px]" />
        </CardContent>
      </Card>
    );
  }

  // Show error state if rendering failed
  if (renderError || candles.length === 0) {
    return (
      <Card className="border-border/50 shadow-premium">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Price Chart</CardTitle>
          </div>
          <CardDescription>{pair}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            {renderError || 'Chart data unavailable'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate chart dimensions using pixel-based coordinates
  const chartHeight = 400;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  
  // Guard against non-positive dimensions
  const innerWidth = Math.max(1, containerWidth - padding.left - padding.right);
  const innerHeight = Math.max(1, chartHeight - padding.top - padding.bottom);

  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = Math.max(0.0001, maxPrice - minPrice); // Guard against zero range
  const priceScale = innerHeight / priceRange;

  const candleWidth = Math.max(2, Math.min(12, innerWidth / candles.length - 2));
  const candleSpacing = innerWidth / candles.length;

  const formatPrice = (price: number) => price.toFixed(4);
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="border-border/50 shadow-premium">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Price Chart</CardTitle>
        </div>
        <CardDescription>{pair} - Last 30 periods (Live)</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="w-full" style={{ minHeight: '400px' }}>
          <svg
            width={containerWidth}
            height={chartHeight}
            className="w-full"
          >
            {/* Background grid */}
            <defs>
              <pattern
                id={`grid-${pair}`}
                width={innerWidth / 5}
                height={innerHeight / 5}
                patternUnits="userSpaceOnUse"
                x={padding.left}
                y={padding.top}
              >
                <path
                  d={`M ${innerWidth / 5} 0 L 0 0 0 ${innerHeight / 5}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border"
                  opacity="0.3"
                />
              </pattern>
            </defs>

            {/* Chart area background */}
            <rect
              x={padding.left}
              y={padding.top}
              width={innerWidth}
              height={innerHeight}
              fill={`url(#grid-${pair})`}
              className="text-muted/5"
            />

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const price = minPrice + priceRange * (1 - ratio);
              const y = padding.top + innerHeight * ratio;
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + innerWidth}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-border"
                    opacity="0.5"
                  />
                  <text
                    x={padding.left - 8}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-xs fill-muted-foreground"
                  >
                    {formatPrice(price)}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels (show every 5th candle) */}
            {candles.map((candle, i) => {
              if (i % 5 !== 0) return null;
              const x = padding.left + i * candleSpacing + candleSpacing / 2;
              return (
                <text
                  key={i}
                  x={x}
                  y={padding.top + innerHeight + 25}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {formatTime(candle.timestamp)}
                </text>
              );
            })}

            {/* Candlesticks */}
            {candles.map((candle, i) => {
              const x = padding.left + i * candleSpacing + candleSpacing / 2;
              const isGreen = candle.close >= candle.open;
              
              const openY = padding.top + innerHeight - (candle.open - minPrice) * priceScale;
              const closeY = padding.top + innerHeight - (candle.close - minPrice) * priceScale;
              const highY = padding.top + innerHeight - (candle.high - minPrice) * priceScale;
              const lowY = padding.top + innerHeight - (candle.low - minPrice) * priceScale;

              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(1, Math.abs(closeY - openY));

              return (
                <g key={i}>
                  {/* Wick (high-low line) */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={isGreen ? 'text-secondary' : 'text-destructive'}
                  />
                  
                  {/* Body (open-close rectangle) */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill="currentColor"
                    className={isGreen ? 'text-secondary' : 'text-destructive'}
                    opacity={isGreen ? 0.8 : 0.9}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary rounded-sm" />
            <span className="text-muted-foreground">Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-sm" />
            <span className="text-muted-foreground">Bearish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-muted-foreground text-xs">Live</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
