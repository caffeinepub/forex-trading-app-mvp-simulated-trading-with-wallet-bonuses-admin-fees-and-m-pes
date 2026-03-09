import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TradePosition } from "../../backend";
import { TradeDirection, TradeStatus } from "../../backend";

interface TradeHistoryTableProps {
  trades: TradePosition[];
}

export default function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  const closedTrades = trades.filter((t) => t.status === TradeStatus.closed);

  if (closedTrades.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No trade history
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
            <TableHead className="text-xs">Open</TableHead>
            <TableHead className="text-xs">Close</TableHead>
            <TableHead className="text-xs">P&L</TableHead>
            <TableHead className="text-xs">Fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {closedTrades.map((trade) => {
            const pnl = trade.profitLoss ?? 0;
            const isProfitable = pnl >= 0;

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
                  ${trade.openPrice.toFixed(4)}
                </TableCell>
                <TableCell className="text-sm">
                  ${trade.closePrice?.toFixed(4) ?? "N/A"}
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium text-sm ${isProfitable ? "text-secondary" : "text-destructive"}`}
                  >
                    ${pnl.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  ${trade.platformFee.toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
