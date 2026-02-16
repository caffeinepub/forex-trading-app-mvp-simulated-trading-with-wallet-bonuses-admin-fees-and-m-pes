import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { TradePosition } from '../../backend';
import { TradeDirection, TradeStatus } from '../../backend';

interface TradeHistoryTableProps {
  trades: TradePosition[];
}

export default function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  const closedTrades = trades.filter(t => t.status === TradeStatus.closed);

  if (closedTrades.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No trade history yet. Close a trade to see it here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pair</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Open Price</TableHead>
              <TableHead>Close Price</TableHead>
              <TableHead>P&L</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Closed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {closedTrades.map((trade) => (
              <TableRow key={trade.tradeId.toString()}>
                <TableCell className="font-medium">{trade.forexPair.symbol}</TableCell>
                <TableCell>
                  <Badge variant={trade.direction === TradeDirection.buy ? 'default' : 'secondary'}>
                    {trade.direction === TradeDirection.buy ? 'BUY' : 'SELL'}
                  </Badge>
                </TableCell>
                <TableCell>${trade.openPrice.toFixed(4)}</TableCell>
                <TableCell>${(trade.closePrice || 0).toFixed(4)}</TableCell>
                <TableCell>
                  <span className={trade.profitLoss && trade.profitLoss >= 0 ? 'text-secondary font-medium' : 'text-destructive font-medium'}>
                    ${(trade.profitLoss || 0).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">${trade.platformFee.toFixed(2)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {trade.closeTimestamp ? formatDate(trade.closeTimestamp) : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
