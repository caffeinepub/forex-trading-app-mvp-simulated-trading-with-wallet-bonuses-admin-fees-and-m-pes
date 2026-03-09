import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuotePolling } from "../../hooks/useQuotePolling";
import { useTradingSessionPrefs } from "../../hooks/useTradingSessionPrefs";
import {
  calculateMA,
  calculateMACD,
  calculateRSI,
} from "../../utils/indicators";
import ChartControls from "./ChartControls";
import IndicatorToggles from "./IndicatorToggles";

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

const TIMEFRAME_INTERVALS: Record<string, number> = {
  "1m": 60000,
  "5m": 300000,
  "15m": 900000,
  "1h": 3600000,
  "4h": 14400000,
  "1d": 86400000,
};

function generateCandleData(
  pair: string,
  timeframe: string,
  count = 50,
): Candle[] {
  const seed = pair
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = 1.0 + (seed % 50) / 100;
  const candles: Candle[] = [];
  const interval = TIMEFRAME_INTERVALS[timeframe] || 3600000;

  let currentPrice = basePrice;
  const now = Date.now();

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * interval;

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

    candles.push({ timestamp, open, high, low, close });
    currentPrice = close + (random4 - 0.5) * volatility * 0.5;
  }

  return candles;
}

function updateLastCandle(candles: Candle[], newPrice: number): Candle[] {
  if (candles.length === 0 || newPrice === 0) return candles;

  const updated = [...candles];
  const lastCandle = updated[updated.length - 1];

  const newClose = newPrice;
  const newHigh = Math.max(lastCandle.high, newClose);
  const newLow = Math.min(lastCandle.low, newClose);

  updated[updated.length - 1] = {
    ...lastCandle,
    close: newClose,
    high: newHigh,
    low: newLow,
  };

  return updated;
}

export default function CandlestickChart({ pair }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);

  const {
    timeframe,
    setTimeframe,
    refreshRate,
    setRefreshRate,
    indicators,
    setIndicators,
  } = useTradingSessionPrefs();
  const { quote, error: quoteError } = useQuotePolling(pair, refreshRate);

  // Initialize candles
  useEffect(() => {
    setIsLoading(true);
    try {
      const initialCandles = generateCandleData(pair, timeframe);
      setCandles(initialCandles);
      setRenderError(null);
    } catch (_error) {
      setRenderError("Failed to generate chart data");
    } finally {
      setIsLoading(false);
    }
  }, [pair, timeframe]);

  // Update last candle with live quote
  useEffect(() => {
    if (quote !== null && quote > 0 && candles.length > 0) {
      setCandles((prev) => updateLastCandle(prev, quote));
    }
  }, [quote, candles.length]);

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Calculate indicators
  const closePrices = candles.map((c) => c.close);
  const maResults = indicators.ma ? calculateMA(closePrices, 20) : [];
  const rsiResults = indicators.rsi ? calculateRSI(closePrices, 14) : [];
  const macdResults = indicators.macd ? calculateMACD(closePrices) : [];

  // Create lookup maps for indicator values by index
  const maMap = new Map(maResults.map((r) => [r.index, r.value]));
  const rsiMap = new Map(rsiResults.map((r) => [r.index, r.value]));
  const macdMap = new Map(macdResults.map((r) => [r.index, r]));

  // Handler for toggling indicators
  const handleToggleIndicator = (indicator: "ma" | "rsi" | "macd") => {
    setIndicators({ [indicator]: !indicators[indicator] });
  };

  // Chart dimensions
  const chartHeight = 400;
  const padding = { top: 20, right: 60, bottom: 40, left: 10 };
  const chartWidth = Math.max(
    containerWidth - padding.left - padding.right,
    400,
  );
  const candleWidth = Math.max(chartWidth / candles.length - 2, 3);

  // Price range
  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...allPrices) * 0.999;
  const maxPrice = Math.max(...allPrices) * 1.001;
  const priceRange = maxPrice - minPrice;

  const priceToY = (price: number) => {
    return (
      padding.top +
      ((maxPrice - price) / priceRange) *
        (chartHeight - padding.top - padding.bottom)
    );
  };

  if (isLoading) {
    return (
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm h-[600px]">
        <CardHeader className="py-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Price Chart</CardTitle>
              <CardDescription>{pair}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="w-full h-[400px]" />
        </CardContent>
      </Card>
    );
  }

  if (renderError) {
    return (
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm h-[600px]">
        <CardHeader className="py-4 pb-3">
          <CardTitle className="text-base">Price Chart</CardTitle>
          <CardDescription>{pair}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center h-[400px] text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" />
            {renderError}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm h-[600px] flex flex-col">
      <CardHeader className="py-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              Price Chart
              {quoteError && (
                <span className="text-xs text-destructive font-normal flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {quoteError}
                </span>
              )}
            </CardTitle>
            <CardDescription>{pair}</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <ChartControls
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            refreshRate={refreshRate}
            onRefreshRateChange={setRefreshRate}
          />
          <IndicatorToggles
            indicators={indicators}
            onToggle={handleToggleIndicator}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0 overflow-hidden" ref={containerRef}>
        <svg
          width={containerWidth}
          height={chartHeight}
          className="w-full"
          style={{ maxWidth: "100%" }}
        >
          <title>Trading Chart</title>
          {/* Grid lines */}
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y =
                padding.top +
                ratio * (chartHeight - padding.top - padding.bottom);
              return (
                <line
                  key={ratio}
                  x1={padding.left}
                  y1={y}
                  x2={containerWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              );
            })}
          </g>

          {/* Moving Average */}
          {indicators.ma && maResults.length > 0 && (
            <polyline
              points={candles
                .map((_candle, i) => {
                  const maValue = maMap.get(i);
                  if (maValue === undefined) return null;
                  const x =
                    padding.left + i * (candleWidth + 2) + candleWidth / 2;
                  const y = priceToY(maValue);
                  return `${x},${y}`;
                })
                .filter(Boolean)
                .join(" ")}
              fill="none"
              stroke="oklch(0.7 0.15 60)"
              strokeWidth="2"
              opacity="0.8"
            />
          )}

          {/* Candlesticks */}
          {candles.map((candle, i) => {
            const x = padding.left + i * (candleWidth + 2);
            const isGreen = candle.close >= candle.open;
            const color = isGreen
              ? "oklch(0.7 0.2 160)"
              : "oklch(0.65 0.25 25)";

            const highY = priceToY(candle.high);
            const lowY = priceToY(candle.low);
            const openY = priceToY(candle.open);
            const closeY = priceToY(candle.close);
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);

            return (
              <g key={`${candle.timestamp}-${i}`}>
                {/* Wick */}
                <line
                  x1={x + candleWidth / 2}
                  y1={highY}
                  x2={x + candleWidth / 2}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={x}
                  y={bodyTop}
                  width={candleWidth}
                  height={Math.max(bodyHeight, 1)}
                  fill={color}
                  opacity="0.9"
                />
              </g>
            );
          })}

          {/* Price labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const price = maxPrice - ratio * priceRange;
            const y =
              padding.top +
              ratio * (chartHeight - padding.top - padding.bottom);
            return (
              <text
                key={ratio}
                x={containerWidth - padding.right + 5}
                y={y + 4}
                fontSize="11"
                fill="currentColor"
                className="opacity-60"
              >
                {price.toFixed(4)}
              </text>
            );
          })}

          {/* RSI Indicator */}
          {indicators.rsi && rsiResults.length > 0 && (
            <g transform={`translate(0, ${chartHeight - 80})`}>
              <text
                x={padding.left}
                y={10}
                fontSize="10"
                fill="currentColor"
                className="opacity-60"
              >
                RSI(14)
              </text>
              <line
                x1={padding.left}
                y1={40}
                x2={containerWidth - padding.right}
                y2={40}
                stroke="currentColor"
                strokeWidth="1"
                className="opacity-20"
              />
              <polyline
                points={candles
                  .map((_, i) => {
                    const rsiValue = rsiMap.get(i);
                    if (rsiValue === undefined) return null;
                    const x =
                      padding.left + i * (candleWidth + 2) + candleWidth / 2;
                    const y = 70 - (rsiValue / 100) * 60;
                    return `${x},${y}`;
                  })
                  .filter(Boolean)
                  .join(" ")}
                fill="none"
                stroke="oklch(0.65 0.2 280)"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* MACD Indicator */}
          {indicators.macd && macdResults.length > 0 && (
            <g transform={`translate(0, ${chartHeight - 80})`}>
              <text
                x={padding.left}
                y={10}
                fontSize="10"
                fill="currentColor"
                className="opacity-60"
              >
                MACD
              </text>
              {candles.map((candle, i) => {
                const macdData = macdMap.get(i);
                if (!macdData) return null;
                const histogram = macdData.histogram;
                const x =
                  padding.left + i * (candleWidth + 2) + candleWidth / 2;
                const barHeight = Math.abs(histogram) * 200;
                const barY = histogram >= 0 ? 40 - barHeight : 40;
                return (
                  <rect
                    key={`macd-${candle.timestamp}-${i}`}
                    x={x - candleWidth / 4}
                    y={barY}
                    width={candleWidth / 2}
                    height={barHeight}
                    fill={
                      histogram >= 0
                        ? "oklch(0.7 0.2 160)"
                        : "oklch(0.65 0.25 25)"
                    }
                    opacity="0.6"
                  />
                );
              })}
            </g>
          )}
        </svg>
      </CardContent>
    </Card>
  );
}
