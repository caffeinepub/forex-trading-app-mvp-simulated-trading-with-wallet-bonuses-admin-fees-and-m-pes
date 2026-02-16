import { useGetPlatformRevenue, useGetAllTradingFees } from '../../hooks/useFees';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign } from 'lucide-react';

export default function RevenuePanel() {
  const { data: revenue = 0 } = useGetPlatformRevenue();
  const { data: fees = [] } = useGetAllTradingFees();

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Total Platform Revenue
          </CardTitle>
          <CardDescription>Total fees collected from trading activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">${revenue.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Fee Events</CardTitle>
          <CardDescription>Trading fees collected from users</CardDescription>
        </CardHeader>
        <CardContent>
          {fees.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No fee events yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Trade ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.slice(0, 20).map((fee) => (
                  <TableRow key={fee.feeId.toString()}>
                    <TableCell className="font-mono text-xs">
                      {fee.user.toString().slice(0, 8)}...
                    </TableCell>
                    <TableCell>#{fee.tradeId.toString()}</TableCell>
                    <TableCell className="font-medium text-primary">
                      ${fee.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(fee.timestamp)}
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
