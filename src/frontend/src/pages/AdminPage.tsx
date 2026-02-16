import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useCurrentUser';
import { useGetPlatformRevenue } from '../hooks/useFees';
import { useGetAllTrades } from '../hooks/useTrading';
import { TradeStatus } from '../backend';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import DepositRequestsReview from '../components/admin/DepositRequestsReview';
import BonusManagement from '../components/admin/BonusManagement';
import RevenuePanel from '../components/admin/RevenuePanel';
import TradingStatsPanel from '../components/admin/TradingStatsPanel';
import UserDirectory from '../components/admin/UserDirectory';
import { useEffect } from 'react';

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const { data: revenue = 0 } = useGetPlatformRevenue();
  const { data: allTrades = [] } = useGetAllTrades();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || isLoading) {
    return null;
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  const openTrades = allTrades.filter(t => t.status === TradeStatus.open);
  const uniqueUsers = new Set(allTrades.map(t => t.user.toString())).size;

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, transactions, and platform settings</p>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${revenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
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
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="deposits" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposits" className="mt-6">
          <DepositRequestsReview />
        </TabsContent>
        
        <TabsContent value="bonuses" className="mt-6">
          <BonusManagement />
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-6">
          <RevenuePanel />
        </TabsContent>
        
        <TabsContent value="trading" className="mt-6">
          <TradingStatsPanel />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <UserDirectory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
