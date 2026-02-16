import { useGetAllTrades } from '../../hooks/useTrading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TradeDirection, TradeStatus } from '../../backend';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function TradingStatsPanel() {
  const { data: allTrades = [] } = useGetAllTrades();

  const openTrades = allTrades.filter(t => t.status === TradeStatus.open);
  const closedTrades = allTrades.filter(t => t.status === TradeStatus.closed);
  
  const totalVolume = allTrades.reduce((sum, t) => sum + t.margin, 0);
  const totalPnL = closedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTrades.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTrades.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>All trading activity across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {allTrades.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No trades yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTrades.slice(0, 20).map((trade) => (
                  <TableRow key={trade.tradeId.toString()}>
                    <TableCell className="font-mono text-xs">
                      {trade.user.toString().slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">{trade.forexPair.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={trade.direction === TradeDirection.buy ? 'default' : 'secondary'}>
                        {trade.direction === TradeDirection.buy ? 'BUY' : 'SELL'}
                      </Badge>
                    </TableCell>
                    <TableCell>${trade.margin.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={trade.status === TradeStatus.open ? 'secondary' : 'outline'}>
                        {trade.status === TradeStatus.open ? 'OPEN' : 'CLOSED'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trade.profitLoss !== undefined && trade.profitLoss !== null ? (
                        <span className={trade.profitLoss >= 0 ? 'text-secondary font-medium' : 'text-destructive font-medium'}>
                          ${trade.profitLoss.toFixed(2)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(trade.openTimestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
