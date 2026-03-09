import { useEffect, useState } from "react";

interface TradingSessionPrefs {
  selectedInstrument: string;
  timeframe: string;
  refreshRate: number;
  indicators: {
    ma: boolean;
    rsi: boolean;
    macd: boolean;
  };
}

const DEFAULT_PREFS: TradingSessionPrefs = {
  selectedInstrument: "EUR/USD",
  timeframe: "1h",
  refreshRate: 2000,
  indicators: {
    ma: false,
    rsi: false,
    macd: false,
  },
};

const STORAGE_KEY = "trading_session_prefs";

function loadPrefs(): TradingSessionPrefs {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error("Failed to load trading preferences:", error);
  }
  return DEFAULT_PREFS;
}

function savePrefs(prefs: TradingSessionPrefs): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error("Failed to save trading preferences:", error);
  }
}

export function useTradingSessionPrefs() {
  const [prefs, setPrefs] = useState<TradingSessionPrefs>(loadPrefs);

  useEffect(() => {
    savePrefs(prefs);
  }, [prefs]);

  return {
    selectedInstrument: prefs.selectedInstrument,
    setSelectedInstrument: (instrument: string) =>
      setPrefs((prev) => ({ ...prev, selectedInstrument: instrument })),

    timeframe: prefs.timeframe,
    setTimeframe: (timeframe: string) =>
      setPrefs((prev) => ({ ...prev, timeframe })),

    refreshRate: prefs.refreshRate,
    setRefreshRate: (refreshRate: number) =>
      setPrefs((prev) => ({ ...prev, refreshRate })),

    indicators: prefs.indicators,
    setIndicators: (indicators: Partial<TradingSessionPrefs["indicators"]>) =>
      setPrefs((prev) => ({
        ...prev,
        indicators: { ...prev.indicators, ...indicators },
      })),
  };
}
