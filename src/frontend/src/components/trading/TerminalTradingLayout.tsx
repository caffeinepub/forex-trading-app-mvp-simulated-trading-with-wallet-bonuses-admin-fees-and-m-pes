import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet } from "lucide-react";
import type { TradePosition } from "../../backend";
import CandlestickChart from "./CandlestickChart";
import InstrumentWatchlist from "./InstrumentWatchlist";
import PositionsPanel from "./PositionsPanel";
import TradeTicket from "./TradeTicket";

interface TerminalTradingLayoutProps {
  balance: number;
  openTrades: TradePosition[];
  tradeHistory: TradePosition[];
  totalPnL: number;
  selectedInstrument: string;
  onInstrumentChange: (instrument: string) => void;
}

export default function TerminalTradingLayout({
  balance,
  openTrades,
  tradeHistory,
  totalPnL,
  selectedInstrument,
  onInstrumentChange,
}: TerminalTradingLayoutProps) {
  return (
    <div className="space-y-4">
      {/* Balance Overview - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 py-3">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-xl font-bold text-primary">
              ${balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 py-3">
            <CardTitle className="text-sm font-medium">
              Open Positions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            <div className="text-xl font-bold">{openTrades.length}</div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 py-3">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            <div
              className={`text-xl font-bold ${totalPnL >= 0 ? "text-secondary" : "text-destructive"}`}
            >
              ${totalPnL.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terminal Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Watchlist */}
        <div className="lg:col-span-2">
          <InstrumentWatchlist
            selectedInstrument={selectedInstrument}
            onInstrumentChange={onInstrumentChange}
          />
        </div>

        {/* Center: Chart */}
        <div className="lg:col-span-7">
          <CandlestickChart pair={selectedInstrument} />
        </div>

        {/* Right: Trade Ticket */}
        <div className="lg:col-span-3">
          <TradeTicket
            selectedPair={selectedInstrument}
            onPairChange={onInstrumentChange}
            availableBalance={balance}
          />
        </div>
      </div>

      {/* Bottom: Positions Panel */}
      <PositionsPanel openTrades={openTrades} tradeHistory={tradeHistory} />
    </div>
  );
}
