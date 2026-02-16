import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useGetAvailableBalance } from '../hooks/useCurrentUser';
import { useGetDepositStatus } from '../hooks/useWallet';
import { useGetUserBonuses } from '../hooks/useBonuses';
import { useGetTradingFees } from '../hooks/useFees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, TrendingUp, Gift } from 'lucide-react';
import DepositForm from '../components/wallet/DepositForm';
import WithdrawForm from '../components/wallet/WithdrawForm';
import RequestsHistory from '../components/wallet/RequestsHistory';
import { useEffect } from 'react';

export default function WalletPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: balance = 0 } = useGetAvailableBalance();
  const { data: deposits = [] } = useGetDepositStatus();
  const { data: bonuses = [] } = useGetUserBonuses();
  const { data: fees = [] } = useGetTradingFees();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const totalBonuses = bonuses.reduce((sum, b) => sum + b.amount, 0);
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your trading balance and transactions</p>
        </div>
      </div>

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
            <CardTitle className="text-sm font-medium">Total Bonuses</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">${totalBonuses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">${totalFees.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <DepositForm />
        <WithdrawForm />
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all your deposits, withdrawals, bonuses, and fees</CardDescription>
        </CardHeader>
        <CardContent>
          <RequestsHistory deposits={deposits} bonuses={bonuses} fees={fees} />
        </CardContent>
      </Card>
    </div>
  );
}
