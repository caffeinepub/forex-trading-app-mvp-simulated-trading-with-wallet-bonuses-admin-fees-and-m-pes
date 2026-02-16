import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, DollarSign, TrendingUp, Users, Gift } from 'lucide-react';
import DepositRequestsReview from '../components/admin/DepositRequestsReview';
import BonusManagement from '../components/admin/BonusManagement';
import RevenuePanel from '../components/admin/RevenuePanel';
import TradingStatsPanel from '../components/admin/TradingStatsPanel';
import UserDirectory from '../components/admin/UserDirectory';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';
import AuthRequiredScreen from '../components/auth/AuthRequiredScreen';
import CenteredLoadingCard from '../components/system/CenteredLoadingCard';
import { setIntendedPath } from '../utils/postLoginRedirect';
import { useEffect } from 'react';

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      setIntendedPath('/admin');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <AuthRequiredScreen 
        title="Admin Login Required"
        description="You need to log in to access the admin dashboard."
      />
    );
  }

  if (isLoading) {
    return <CenteredLoadingCard message="Checking permissions..." />;
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Admin Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 shadow-premium">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>Manage platform operations and user accounts</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Admin Tabs */}
      <Tabs defaultValue="deposits" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="deposits" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Deposits
          </TabsTrigger>
          <TabsTrigger value="bonuses" className="gap-2">
            <Gift className="h-4 w-4" />
            Bonuses
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="trading" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trading
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposits" className="mt-6">
          <Card className="border-border/50 shadow-premium">
            <CardHeader>
              <CardTitle>Deposit Requests</CardTitle>
              <CardDescription>Review and approve pending deposit requests</CardDescription>
            </CardHeader>
            <CardContent>
              <DepositRequestsReview />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonuses" className="mt-6">
          <Card className="border-border/50 shadow-premium">
            <CardHeader>
              <CardTitle>Bonus Management</CardTitle>
              <CardDescription>Apply bonuses to user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <BonusManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <Card className="border-border/50 shadow-premium">
            <CardHeader>
              <CardTitle>Platform Revenue</CardTitle>
              <CardDescription>View total revenue and recent fees</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenuePanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trading" className="mt-6">
          <Card className="border-border/50 shadow-premium">
            <CardHeader>
              <CardTitle>Trading Statistics</CardTitle>
              <CardDescription>Platform-wide trading metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <TradingStatsPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="border-border/50 shadow-premium">
            <CardHeader>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <UserDirectory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
