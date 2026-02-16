import { useState } from 'react';
import { useGetAllBonuses, useApplyBonus } from '../../hooks/useBonuses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BonusType } from '../../backend';
import { Gift } from 'lucide-react';

export default function BonusManagement() {
  const { data: bonuses = [] } = useGetAllBonuses();
  const applyBonusMutation = useApplyBonus();

  const [targetUser, setTargetUser] = useState('');
  const [amount, setAmount] = useState('');
  const [bonusType, setBonusType] = useState<string>('depositMatch');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const typeMap: Record<string, BonusType> = {
      depositMatch: BonusType.depositMatch,
      signup: BonusType.signup,
      loyalty: BonusType.loyalty
    };

    applyBonusMutation.mutate(
      {
        targetUser,
        amount: parseFloat(amount),
        bonusType: typeMap[bonusType],
        description
      },
      {
        onSuccess: () => {
          setTargetUser('');
          setAmount('');
          setDescription('');
        }
      }
    );
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Apply Bonus
          </CardTitle>
          <CardDescription>Grant promotional credits to users</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-user">User Principal</Label>
              <Input
                id="target-user"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                placeholder="Enter user principal ID"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bonus-amount">Amount (USD)</Label>
                <Input
                  id="bonus-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bonus-type">Bonus Type</Label>
                <Select value={bonusType} onValueChange={setBonusType}>
                  <SelectTrigger id="bonus-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="depositMatch">Deposit Match</SelectItem>
                    <SelectItem value="signup">Sign Up</SelectItem>
                    <SelectItem value="loyalty">Loyalty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonus-description">Description</Label>
              <Input
                id="bonus-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Welcome bonus"
                required
              />
            </div>

            <Button type="submit" disabled={applyBonusMutation.isPending}>
              {applyBonusMutation.isPending ? 'Applying...' : 'Apply Bonus'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bonuses</CardTitle>
          <CardDescription>All bonuses applied to users</CardDescription>
        </CardHeader>
        <CardContent>
          {bonuses.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No bonuses applied yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bonuses.slice(0, 10).map((bonus) => (
                  <TableRow key={bonus.bonusId.toString()}>
                    <TableCell className="font-mono text-xs">
                      {bonus.user.toString().slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium text-secondary">
                      ${bonus.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {Object.keys(bonus.bonusType)[0]}
                    </TableCell>
                    <TableCell>{bonus.description}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(bonus.timestamp)}
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
