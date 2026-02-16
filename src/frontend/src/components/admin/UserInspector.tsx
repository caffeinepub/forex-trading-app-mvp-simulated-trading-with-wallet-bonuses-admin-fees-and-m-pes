import { useGetAllTrades } from '../../hooks/useTrading';
import { useGetAllDepositRequests } from '../../hooks/useWallet';
import { useGetAllBonuses } from '../../hooks/useBonuses';
import { useGetAllTradingFees } from '../../hooks/useFees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TradeDirection, TradeStatus } from '../../backend';
import { User } from 'lucide-react';

interface UserInspectorProps {
  userPrincipal: string;
}

export default function UserInspector({ userPrincipal }: UserInspectorProps) {
  const { data: allTrades = [] } = useGetAllTrades();
  const { data: allDeposits = [] } = useGetAllDepositRequests();
  const { data: allBonuses = [] } = useGetAllBonuses();
  const { data: allFees = [] } = useGetAllTradingFees();

  const userTrades = allTrades.filter(t => t.user.toString() === userPrincipal);
  const userDeposits = allDeposits.filter(d => d.user.toString() === userPrincipal);
  const userBonuses = allBonuses.filter(b => b.user.toString() === userPrincipal);
  const userFees = allFees.filter(f => f.user.toString() === userPrincipal);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  const totalPnL = userTrades
    .filter(t => t.profitLoss !== undefined && t.profitLoss !== null)
    .reduce((sum, t) => sum + (t.profitLoss || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Profile
          </CardTitle>
          <CardDescription className="font-mono text-xs break-all">
            {userPrincipal}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Trades</div>
              <div className="text-2xl font-bold">{userTrades.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total P&L</div>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                ${totalPnL.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Deposits</div>
              <div className="text-2xl font-bold">{userDeposits.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Bonuses</div>
              <div className="text-2xl font-bold">{userBonuses.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {userTrades.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No trades yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pair</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Margin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTrades.slice(0, 10).map((trade) => (
                  <TableRow key={trade.tradeId.toString()}>
                    <TableCell>{trade.forexPair.symbol}</TableCell>
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
                        <span className={trade.profitLoss >= 0 ? 'text-secondary' : 'text-destructive'}>
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

      <Card>
        <CardHeader>
          <CardTitle>Wallet Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status/Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userDeposits.map((deposit) => (
                <TableRow key={`deposit-${deposit.requestId}`}>
                  <TableCell>
                    <Badge variant="outline">DEPOSIT</Badge>
                  </TableCell>
                  <TableCell className="text-secondary">${deposit.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge>{Object.keys(deposit.status)[0].toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(deposit.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
              {userBonuses.map((bonus) => (
                <TableRow key={`bonus-${bonus.bonusId}`}>
                  <TableCell>
                    <Badge variant="outline">BONUS</Badge>
                  </TableCell>
                  <TableCell className="text-secondary">${bonus.amount.toFixed(2)}</TableCell>
                  <TableCell>{bonus.description}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(bonus.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
              {userFees.map((fee) => (
                <TableRow key={`fee-${fee.feeId}`}>
                  <TableCell>
                    <Badge variant="outline">FEE</Badge>
                  </TableCell>
                  <TableCell className="text-destructive">-${fee.amount.toFixed(2)}</TableCell>
                  <TableCell>Trade #{fee.tradeId.toString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(fee.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
