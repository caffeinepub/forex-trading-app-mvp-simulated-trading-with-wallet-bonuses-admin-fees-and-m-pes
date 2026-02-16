import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { DepositRequest, Bonus, TradingFee } from '../../backend';

interface RequestsHistoryProps {
  deposits: DepositRequest[];
  bonuses: Bonus[];
  fees: TradingFee[];
}

type HistoryItem = {
  type: 'deposit' | 'bonus' | 'fee';
  timestamp: bigint;
  amount: number;
  status?: string;
  description?: string;
};

export default function RequestsHistory({ deposits, bonuses, fees }: RequestsHistoryProps) {
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status.toUpperCase()}</Badge>;
  };

  const history: HistoryItem[] = [
    ...deposits.map(d => ({
      type: 'deposit' as const,
      timestamp: d.timestamp,
      amount: d.amount,
      status: Object.keys(d.status)[0],
      description: `Deposit request`
    })),
    ...bonuses.map(b => ({
      type: 'bonus' as const,
      timestamp: b.timestamp,
      amount: b.amount,
      description: b.description
    })),
    ...fees.map(f => ({
      type: 'fee' as const,
      timestamp: f.timestamp,
      amount: -f.amount,
      description: `Trading fee for trade #${f.tradeId}`
    }))
  ].sort((a, b) => Number(b.timestamp - a.timestamp));

  if (history.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        No transaction history yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <Badge variant="outline">
                {item.type.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>
              <span className={item.amount >= 0 ? 'text-secondary font-medium' : 'text-destructive font-medium'}>
                {item.amount >= 0 ? '+' : ''}${item.amount.toFixed(2)}
              </span>
            </TableCell>
            <TableCell>
              {item.status ? getStatusBadge(item.status) : '-'}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(item.timestamp)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
