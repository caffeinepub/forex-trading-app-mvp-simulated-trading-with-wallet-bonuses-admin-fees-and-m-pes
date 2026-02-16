import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAvailableBalance } from '../hooks/useCurrentUser';
import { useGetOpenTrades, useGetTradeHistory } from '../hooks/useTrading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, TrendingUp, Wallet } from 'lucide-react';
import TradeTicket from '../components/trading/TradeTicket';
import OpenTradesTable from '../components/trading/OpenTradesTable';
import TradeHistoryTable from '../components/trading/TradeHistoryTable';
import AuthRequiredScreen from '../components/auth/AuthRequiredScreen';
import { setIntendedPath } from '../utils/postLoginRedirect';
import { useEffect } from 'react';

export default function TradingPage() {
  const { identity } = useInternetIdentity();
  const { data: balance = 0 } = useGetAvailableBalance();
  const { data: openTrades = [] } = useGetOpenTrades();
  const { data: tradeHistory = [] } = useGetTradeHistory();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      setIntendedPath('/trading');
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
    .filter(t => t.profitLoss !== undefined && t.profitLoss !== null)
    .reduce((sum, t) => sum + (t.profitLoss || 0), 0);

  return (
    <div className="container py-8 space-y-6">
      {/* Risk Disclaimer */}
      <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 backdrop-blur-sm">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Risk Warning:</strong> Trading involves significant risk. This is a simulated trading platform. 
          Profits are not guaranteed and losses can occur. Trade responsibly.
        </AlertDescription>
      </Alert>

      {/* Balance Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border/50 hover:border-primary/30 transition-colors shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${balance.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-primary/30 transition-colors shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTrades.length}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-primary/30 transition-colors shadow-premium">
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
          <Card className="border-border/50 shadow-premium">
            <CardHeader>
              <CardTitle>Your Positions</CardTitle>
              <CardDescription>Manage your open trades and view history</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="open" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="open">Open Trades ({openTrades.length})</TabsTrigger>
                  <TabsTrigger value="history">History ({tradeHistory.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="open" className="mt-4">
                  <OpenTradesTable trades={openTrades} />
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <TradeHistoryTable trades={tradeHistory} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
