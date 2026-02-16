import { useGetAllTrades } from '../../hooks/useTrading';
import { useGetAllDepositRequests } from '../../hooks/useWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useState } from 'react';
import UserInspector from './UserInspector';

export default function UserDirectory() {
  const { data: allTrades = [] } = useGetAllTrades();
  const { data: allDeposits = [] } = useGetAllDepositRequests();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Derive unique users from all data sources
  const userPrincipals = new Set<string>();
  allTrades.forEach(t => userPrincipals.add(t.user.toString()));
  allDeposits.forEach(d => userPrincipals.add(d.user.toString()));

  const users = Array.from(userPrincipals);

  if (selectedUser) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedUser(null)}>
          ← Back to User Directory
        </Button>
        <UserInspector userPrincipal={selectedUser} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Directory
        </CardTitle>
        <CardDescription>View and inspect all platform users</CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No users yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Principal ID</TableHead>
                <TableHead>Trades</TableHead>
                <TableHead>Deposits</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((principal) => {
                const userTrades = allTrades.filter(t => t.user.toString() === principal);
                const userDeposits = allDeposits.filter(d => d.user.toString() === principal);
                
                return (
                  <TableRow key={principal}>
                    <TableCell className="font-mono text-xs">
                      {principal.slice(0, 16)}...
                    </TableCell>
                    <TableCell>{userTrades.length}</TableCell>
                    <TableCell>{userDeposits.length}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(principal)}
                      >
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
