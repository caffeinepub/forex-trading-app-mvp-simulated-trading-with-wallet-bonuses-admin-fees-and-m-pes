import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";
import { useState } from "react";
import type { TradePosition } from "../../backend";
import { TradeDirection } from "../../backend";
import { useCloseTrade } from "../../hooks/useTrading";

interface OpenTradesTableProps {
  trades: TradePosition[];
}

export default function OpenTradesTable({ trades }: OpenTradesTableProps) {
  const closeTradeM = useCloseTrade();
  const [closingTradeId, setClosingTradeId] = useState<bigint | null>(null);

  const handleCloseTrade = async (tradeId: bigint) => {
    setClosingTradeId(tradeId);
    try {
      await closeTradeM.mutateAsync(tradeId);
    } finally {
      setClosingTradeId(null);
    }
  };

  if (trades.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No open trades
      </div>
    );
  }

  return (
    <div className="border border-border/40 rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="text-xs">Pair</TableHead>
            <TableHead className="text-xs">Direction</TableHead>
            <TableHead className="text-xs">Leverage</TableHead>
            <TableHead className="text-xs">Margin</TableHead>
            <TableHead className="text-xs">Open Price</TableHead>
            <TableHead className="text-xs">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => {
            const isClosing =
              closingTradeId?.toString() === trade.tradeId.toString();

            return (
              <TableRow
                key={trade.tradeId.toString()}
                className="hover:bg-muted/20"
              >
                <TableCell className="font-medium text-sm">
                  {trade.forexPair.symbol}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      trade.direction === TradeDirection.buy
                        ? "default"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {trade.direction === TradeDirection.buy ? "BUY" : "SELL"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  1:{trade.leverage.toString()}
                </TableCell>
                <TableCell className="text-sm">
                  ${trade.margin.toFixed(2)}
                </TableCell>
                <TableCell className="text-sm">
                  ${trade.openPrice.toFixed(4)}
                </TableCell>
                <TableCell>
                  {isClosing ? (
                    <span className="text-xs text-muted-foreground">
                      Closing...
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCloseTrade(trade.tradeId)}
                      disabled={closeTradeM.isPending}
                      className="h-7 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
