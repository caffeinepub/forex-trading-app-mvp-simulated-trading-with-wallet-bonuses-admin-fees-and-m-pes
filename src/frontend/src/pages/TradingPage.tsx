import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import AuthRequiredScreen from "../components/auth/AuthRequiredScreen";
import TerminalTradingLayout from "../components/trading/TerminalTradingLayout";
import { useGetAvailableBalance } from "../hooks/useCurrentUser";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetOpenTrades, useGetTradeHistory } from "../hooks/useTrading";
import { useTradingSessionPrefs } from "../hooks/useTradingSessionPrefs";
import { setIntendedPath } from "../utils/postLoginRedirect";

export default function TradingPage() {
  const { identity } = useInternetIdentity();
  const { data: balance = 0 } = useGetAvailableBalance();
  const { data: openTrades = [] } = useGetOpenTrades();
  const { data: tradeHistory = [] } = useGetTradeHistory();

  const { selectedInstrument, setSelectedInstrument } =
    useTradingSessionPrefs();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      setIntendedPath("/trading");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <AuthRequiredScreen
        title="Login Required"
        description="You need to log in to access the trading platform."
      />
    );
  }

  const totalPnL = tradeHistory
    .filter((t) => t.profitLoss !== undefined && t.profitLoss !== null)
    .reduce((sum, t) => sum + (t.profitLoss || 0), 0);

  return (
    <div className="container-fluid py-4 space-y-4 max-w-[1920px] mx-auto">
      {/* Risk Disclaimer */}
      <Alert
        variant="destructive"
        className="border-destructive/50 bg-destructive/10 backdrop-blur-sm"
      >
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Risk Warning:</strong> Trading involves significant risk. This
          is a simulated trading platform with polling-based price updates.
          Profits are not guaranteed and losses can occur. Trade responsibly.
        </AlertDescription>
      </Alert>

      {/* Terminal Layout */}
      <TerminalTradingLayout
        balance={balance}
        openTrades={openTrades}
        tradeHistory={tradeHistory}
        totalPnL={totalPnL}
        selectedInstrument={selectedInstrument}
        onInstrumentChange={setSelectedInstrument}
      />
    </div>
  );
}
