import { useState } from 'react';
import { useDepositFunds } from '../../hooks/useWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MpesaInstructionsCard from './MpesaInstructionsCard';
import { DollarSign } from 'lucide-react';

export default function DepositForm() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaRef, setMpesaRef] = useState('');

  const depositMutation = useDepositFunds();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let mpesaReference: string | null = null;
    if (paymentMethod === 'mpesa') {
      mpesaReference = JSON.stringify({
        phone: mpesaPhone,
        reference: mpesaRef
      });
    }

    depositMutation.mutate(
      { amount: parseFloat(amount), mpesaRef: mpesaReference },
      {
        onSuccess: () => {
          setAmount('');
          setMpesaPhone('');
          setMpesaRef('');
        }
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Deposit Funds
        </CardTitle>
        <CardDescription>Add funds to your trading account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deposit-amount">Amount (USD)</Label>
            <Input
              id="deposit-amount"
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
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="payment-method">
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
              <MpesaInstructionsCard type="deposit" />
              
              <div className="space-y-2">
                <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
                <Input
                  id="mpesa-phone"
                  type="tel"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  placeholder="+254..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mpesa-ref">M-Pesa Transaction Code</Label>
                <Input
                  id="mpesa-ref"
                  value={mpesaRef}
                  onChange={(e) => setMpesaRef(e.target.value)}
                  placeholder="e.g., QA12BC3D4E"
                  required
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={depositMutation.isPending}
          >
            {depositMutation.isPending ? 'Submitting...' : 'Submit Deposit Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
