import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAvailableBalance } from '../hooks/useCurrentUser';
import { useGetDepositStatus } from '../hooks/useWallet';
import { useGetUserBonuses } from '../hooks/useBonuses';
import { useGetTradingFees } from '../hooks/useFees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import DepositForm from '../components/wallet/DepositForm';
import WithdrawForm from '../components/wallet/WithdrawForm';
import RequestsHistory from '../components/wallet/RequestsHistory';
import MpesaInstructionsCard from '../components/wallet/MpesaInstructionsCard';
import AuthRequiredScreen from '../components/auth/AuthRequiredScreen';
import { setIntendedPath } from '../utils/postLoginRedirect';
import { useEffect } from 'react';

export default function WalletPage() {
  const { identity } = useInternetIdentity();
  const { data: balance = 0 } = useGetAvailableBalance();
  const { data: deposits = [] } = useGetDepositStatus();
  const { data: bonuses = [] } = useGetUserBonuses();
  const { data: fees = [] } = useGetTradingFees();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      setIntendedPath('/wallet');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <AuthRequiredScreen 
        title="Login Required"
        description="You need to log in to access your wallet."
      />
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Balance Overview */}
      <Card className="border-border/50 hover:border-primary/30 transition-colors shadow-premium">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <CardDescription>Your current trading balance</CardDescription>
          </div>
          <Wallet className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">${balance.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Deposit/Withdraw Forms */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/50 hover:border-secondary/30 transition-colors shadow-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <CardTitle>Deposit Funds</CardTitle>
            </div>
            <CardDescription>Add funds to your trading account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MpesaInstructionsCard type="deposit" />
            <DepositForm />
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:border-destructive/30 transition-colors shadow-premium">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <CardTitle>Withdraw Funds</CardTitle>
            </div>
            <CardDescription>Withdraw funds from your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MpesaInstructionsCard type="withdrawal" />
            <WithdrawForm />
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="border-border/50 shadow-premium">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View your deposits, bonuses, and fees</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <RequestsHistory deposits={deposits} bonuses={bonuses} fees={fees} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
