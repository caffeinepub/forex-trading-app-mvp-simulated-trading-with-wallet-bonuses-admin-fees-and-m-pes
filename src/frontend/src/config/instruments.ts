export interface Instrument {
  symbol: string;
  name: string;
  category: "forex" | "indices";
  isSimulated: boolean;
  isSupported: boolean; // Whether backend supports quotes for this instrument
}

export const INSTRUMENTS: Instrument[] = [
  // Major Forex Pairs - Supported by backend
  {
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    category: "forex",
    isSimulated: false,
    isSupported: true,
  },
  {
    symbol: "GBP/USD",
    name: "British Pound / US Dollar",
    category: "forex",
    isSimulated: false,
    isSupported: true,
  },
  {
    symbol: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    category: "forex",
    isSimulated: false,
    isSupported: true,
  },
  {
    symbol: "USD/CHF",
    name: "US Dollar / Swiss Franc",
    category: "forex",
    isSimulated: false,
    isSupported: true,
  },

  // Other Forex Pairs - Not supported by backend quotes (will return 0.0)
  {
    symbol: "AUD/USD",
    name: "Australian Dollar / US Dollar",
    category: "forex",
    isSimulated: false,
    isSupported: false,
  },
  {
    symbol: "USD/CAD",
    name: "US Dollar / Canadian Dollar",
    category: "forex",
    isSimulated: false,
    isSupported: false,
  },
  {
    symbol: "NZD/USD",
    name: "New Zealand Dollar / US Dollar",
    category: "forex",
    isSimulated: false,
    isSupported: false,
  },

  // Simulated Indices - Not supported by backend quotes
  {
    symbol: "VOL-10",
    name: "Simulated Volatility Index 10",
    category: "indices",
    isSimulated: true,
    isSupported: false,
  },
  {
    symbol: "VOL-25",
    name: "Simulated Volatility Index 25",
    category: "indices",
    isSimulated: true,
    isSupported: false,
  },
  {
    symbol: "VOL-50",
    name: "Simulated Volatility Index 50",
    category: "indices",
    isSimulated: true,
    isSupported: false,
  },
  {
    symbol: "VOL-75",
    name: "Simulated Volatility Index 75",
    category: "indices",
    isSimulated: true,
    isSupported: false,
  },
  {
    symbol: "VOL-100",
    name: "Simulated Volatility Index 100",
    category: "indices",
    isSimulated: true,
    isSupported: false,
  },
];

// Helper to get supported instruments for trading
export function getSupportedInstruments(): Instrument[] {
  return INSTRUMENTS.filter((i) => i.isSupported);
}

// Helper to check if an instrument is supported
export function isInstrumentSupported(symbol: string): boolean {
  const instrument = INSTRUMENTS.find((i) => i.symbol === symbol);
  return instrument?.isSupported ?? false;
}
