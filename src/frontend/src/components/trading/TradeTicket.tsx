import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { TradeDirection } from "../../backend";
import { INSTRUMENTS } from "../../config/instruments";
import { useQuotePolling } from "../../hooks/useQuotePolling";
import { useOpenTrade } from "../../hooks/useTrading";
import { useTradingSessionPrefs } from "../../hooks/useTradingSessionPrefs";

interface TradeTicketProps {
  selectedPair?: string;
  onPairChange?: (pair: string) => void;
  availableBalance: number;
}

export default function TradeTicket({
  selectedPair = "EUR/USD",
  onPairChange,
  availableBalance,
}: TradeTicketProps) {
  const [direction, setDirection] = useState<"buy" | "sell">("buy");
  const [leverage, setLeverage] = useState("10");
  const [margin, setMargin] = useState("100");

  const { refreshRate } = useTradingSessionPrefs();
  const { quote, error: quoteError } = useQuotePolling(
    selectedPair,
    refreshRate,
  );
  const openTradeMutation = useOpenTrade();

  // Validate margin against available balance
  const marginValue = Number.parseFloat(margin) || 0;
  const isMarginValid = marginValue > 0 && marginValue <= availableBalance;
  const validationError = useMemo(() => {
    if (!margin || marginValue === 0) return null;
    if (marginValue > availableBalance) {
      return `Insufficient balance. Available: $${availableBalance.toFixed(2)}`;
    }
    return null;
  }, [margin, marginValue, availableBalance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isMarginValid) return;

    const tradeDirection: TradeDirection =
      direction === "buy" ? TradeDirection.buy : TradeDirection.sell;

    await openTradeMutation.mutateAsync({
      pairSymbol: selectedPair,
      direction: tradeDirection,
      leverage: BigInt(leverage),
      margin: marginValue,
    });

    setMargin("100");
  };

  const isLoading = openTradeMutation.isPending;
  const canSubmit = isMarginValid && !isLoading && marginValue > 0;

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm h-[600px] flex flex-col">
      <CardHeader className="py-4 pb-3">
        <CardTitle className="text-base">Trade Ticket</CardTitle>
        <CardDescription>Open a new position</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pair" className="text-sm">
              Instrument
            </Label>
            <Select value={selectedPair} onValueChange={onPairChange}>
              <SelectTrigger id="pair" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INSTRUMENTS.map((instrument) => (
                  <SelectItem key={instrument.symbol} value={instrument.symbol}>
                    <div className="flex items-center gap-2">
                      <span>{instrument.symbol}</span>
                      {instrument.isSimulated && (
                        <span className="text-[10px] text-muted-foreground">
                          (Simulated)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Price Display */}
          <div className="space-y-2">
            <Label className="text-sm">Current Price</Label>
            <div className="h-9 px-3 py-2 border border-border/40 rounded-md bg-muted/20 flex items-center justify-between">
              {quoteError ? (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {quoteError}
                </span>
              ) : quote !== null && quote > 0 ? (
                <span className="text-sm font-mono font-medium">
                  ${quote.toFixed(4)}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Loading price...
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Direction</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={direction === "buy" ? "default" : "outline"}
                className={
                  direction === "buy"
                    ? "bg-secondary hover:bg-secondary/90"
                    : ""
                }
                onClick={() => setDirection("buy")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Buy
              </Button>
              <Button
                type="button"
                variant={direction === "sell" ? "default" : "outline"}
                className={
                  direction === "sell"
                    ? "bg-destructive hover:bg-destructive/90"
                    : ""
                }
                onClick={() => setDirection("sell")}
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                Sell
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leverage" className="text-sm">
              Leverage
            </Label>
            <Select value={leverage} onValueChange={setLeverage}>
              <SelectTrigger id="leverage" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1:1</SelectItem>
                <SelectItem value="5">1:5</SelectItem>
                <SelectItem value="10">1:10</SelectItem>
                <SelectItem value="20">1:20</SelectItem>
                <SelectItem value="50">1:50</SelectItem>
                <SelectItem value="100">1:100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin" className="text-sm">
              Margin (USD)
              <span className="ml-2 text-xs text-muted-foreground">
                Available: ${availableBalance.toFixed(2)}
              </span>
            </Label>
            <Input
              id="margin"
              type="number"
              step="0.01"
              min="1"
              max={availableBalance}
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="Enter margin amount"
              className="h-9"
              required
            />
            {validationError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationError}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!canSubmit}>
            {isLoading ? "Opening Trade..." : "Open Trade"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
