export interface MAResult {
  index: number;
  value: number;
}

export interface RSIResult {
  index: number;
  value: number;
}

export interface MACDResult {
  index: number;
  macd: number;
  signal: number;
  histogram: number;
}

export function calculateMA(closes: number[], period = 20): MAResult[] {
  const results: MAResult[] = [];

  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, val) => acc + val, 0);
    const avg = sum / period;
    results.push({ index: i, value: avg });
  }

  return results;
}

export function calculateRSI(closes: number[], period = 14): RSIResult[] {
  const results: RSIResult[] = [];

  if (closes.length < period + 1) return results;

  const changes: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }

  for (let i = period; i < changes.length; i++) {
    const slice = changes.slice(i - period, i);
    const gains = slice.filter((c) => c > 0);
    const losses = slice.filter((c) => c < 0).map((c) => Math.abs(c));

    const avgGain =
      gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0;
    const avgLoss =
      losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    results.push({ index: i, value: rsi });
  }

  return results;
}

export function calculateMACD(
  closes: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9,
): MACDResult[] {
  const results: MACDResult[] = [];

  if (closes.length < slowPeriod) return results;

  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);

  const macdLine: number[] = [];
  const startIndex = slowPeriod - 1;

  for (let i = startIndex; i < closes.length; i++) {
    const fastValue = fastEMA[i - (fastPeriod - 1)];
    const slowValue = slowEMA[i - startIndex];
    macdLine.push(fastValue - slowValue);
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);

  for (let i = signalPeriod - 1; i < macdLine.length; i++) {
    const macd = macdLine[i];
    const signal = signalLine[i - (signalPeriod - 1)];
    const histogram = macd - signal;

    results.push({
      index: startIndex + i,
      macd,
      signal,
      histogram,
    });
  }

  return results;
}

function calculateEMA(values: number[], period: number): number[] {
  const results: number[] = [];
  const multiplier = 2 / (period + 1);

  let ema = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  results.push(ema);

  for (let i = period; i < values.length; i++) {
    ema = (values[i] - ema) * multiplier + ema;
    results.push(ema);
  }

  return results;
}
