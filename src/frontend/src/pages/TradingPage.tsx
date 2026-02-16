import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useGetAvailableBalance } from '../hooks/useCurrentUser';
import { useGetOpenTrades, useGetTradeHistory } from '../hooks/useTrading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, Wallet } from 'lucide-react';
import TradeTicket from '../components/trading/TradeTicket';
import OpenTradesTable from '../components/trading/OpenTradesTable';
import TradeHistoryTable from '../components/trading/TradeHistoryTable';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function TradingPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: balance = 0 } = useGetAvailableBalance();
  const { data: openTrades = [] } = useGetOpenTrades();
  const { data: tradeHistory = [] } = useGetTradeHistory();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const totalPnL = tradeHistory
    .filter(t => t.profitLoss !== undefined && t.profitLoss !== null)
    .reduce((sum, t) => sum + (t.profitLoss || 0), 0);

  return (
    <div className="container py-8 space-y-6">
      {/* Risk Disclaimer */}
      <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Risk Warning:</strong> Trading involves significant risk. This is a simulated trading platform. 
          Profits are not guaranteed and losses can occur. Trade responsibly.
        </AlertDescription>
      </Alert>

      {/* Balance Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${balance.toFixed(2)}</div>
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
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-secondary' : 'text-destructive'}`}>
              ${totalPnL.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Interface */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TradeTicket />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="open" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="open">Open Trades</TabsTrigger>
              <TabsTrigger value="history">Trade History</TabsTrigger>
            </TabsList>
            <TabsContent value="open" className="mt-6">
              <OpenTradesTable trades={openTrades} />
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <TradeHistoryTable trades={tradeHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {balance === 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              You need funds to start trading. Visit the wallet page to make a deposit.
            </p>
            <Button onClick={() => navigate({ to: '/wallet' })}>
              Go to Wallet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
