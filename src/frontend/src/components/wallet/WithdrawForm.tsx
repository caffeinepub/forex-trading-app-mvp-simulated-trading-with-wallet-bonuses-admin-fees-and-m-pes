import { useState } from 'react';
import { useWithdrawFunds } from '../../hooks/useWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MpesaInstructionsCard from './MpesaInstructionsCard';
import { ArrowUpRight } from 'lucide-react';

export default function WithdrawForm() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');

  const withdrawMutation = useWithdrawFunds();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    withdrawMutation.mutate(parseFloat(amount), {
      onSuccess: () => {
        setAmount('');
        setMpesaPhone('');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5" />
          Withdraw Funds
        </CardTitle>
        <CardDescription>Withdraw funds from your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Amount (USD)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdraw-method">Withdrawal Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="withdraw-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === 'mpesa' && (
            <>
              <MpesaInstructionsCard type="withdrawal" />
              
              <div className="space-y-2">
                <Label htmlFor="withdraw-mpesa-phone">M-Pesa Phone Number</Label>
                <Input
                  id="withdraw-mpesa-phone"
                  type="tel"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="+254..."
                  required
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={withdrawMutation.isPending}
          >
            {withdrawMutation.isPending ? 'Processing...' : 'Request Withdrawal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
