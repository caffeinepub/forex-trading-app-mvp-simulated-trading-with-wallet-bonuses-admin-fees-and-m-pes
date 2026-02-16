import { useCloseTrade } from '../../hooks/useTrading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { TradePosition } from '../../backend';
import { TradeDirection } from '../../backend';
import { X } from 'lucide-react';

interface OpenTradesTableProps {
  trades: TradePosition[];
}

export default function OpenTradesTable({ trades }: OpenTradesTableProps) {
  const closeTraceMutation = useCloseTrade();

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  if (trades.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No open trades. Open a trade to get started.
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
              <TableHead>Leverage</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead>Open Price</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map((trade) => (
              <TableRow key={trade.tradeId.toString()}>
                <TableCell className="font-medium">{trade.forexPair.symbol}</TableCell>
                <TableCell>
                  <Badge variant={trade.direction === TradeDirection.buy ? 'default' : 'secondary'}>
                    {trade.direction === TradeDirection.buy ? 'BUY' : 'SELL'}
                  </Badge>
                </TableCell>
                <TableCell>1:{trade.leverage.toString()}</TableCell>
                <TableCell>${trade.margin.toFixed(2)}</TableCell>
                <TableCell>${trade.openPrice.toFixed(4)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(trade.openTimestamp)}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => closeTraceMutation.mutate(trade.tradeId)}
                    disabled={closeTraceMutation.isPending}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
