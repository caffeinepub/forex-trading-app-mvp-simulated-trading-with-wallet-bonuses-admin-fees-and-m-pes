import { useState } from 'react';
import { useOpenTrade } from '../../hooks/useTrading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TradeDirection } from '../../backend';
import { TrendingUp, TrendingDown } from 'lucide-react';

const FOREX_PAIRS = [
  'EUR/USD',
  'GBP/USD',
  'USD/JPY',
  'USD/CHF',
  'AUD/USD',
  'USD/CAD',
  'NZD/USD'
];

interface TradeTicketProps {
  selectedPair?: string;
  onPairChange?: (pair: string) => void;
}

export default function TradeTicket({ selectedPair, onPairChange }: TradeTicketProps) {
  const [pair, setPair] = useState(selectedPair || 'EUR/USD');
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');
  const [leverage, setLeverage] = useState('10');
  const [margin, setMargin] = useState('100');

  const openTradeMutation = useOpenTrade();

  const handlePairChange = (newPair: string) => {
    setPair(newPair);
    if (onPairChange) {
      onPairChange(newPair);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tradeDirection: TradeDirection = direction === 'buy' 
      ? { buy: null } as any 
      : { sell: null } as any;

    openTradeMutation.mutate({
      pairSymbol: pair,
      direction: tradeDirection,
      leverage: BigInt(leverage),
      margin: parseFloat(margin)
    });
  };

  return (
    <Card className="border-border/50 shadow-premium">
      <CardHeader>
        <CardTitle>Open Trade</CardTitle>
        <CardDescription>Enter your trade parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pair">Currency Pair</Label>
            <Select value={pair} onValueChange={handlePairChange}>
              <SelectTrigger id="pair">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOREX_PAIRS.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Direction</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={direction === 'buy' ? 'default' : 'outline'}
                onClick={() => setDirection('buy')}
                className="gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Buy
              </Button>
              <Button
                type="button"
                variant={direction === 'sell' ? 'default' : 'outline'}
                onClick={() => setDirection('sell')}
                className="gap-2"
              >
                <TrendingDown className="w-4 h-4" />
                Sell
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leverage">Leverage</Label>
            <Select value={leverage} onValueChange={setLeverage}>
              <SelectTrigger id="leverage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1:1</SelectItem>
                <SelectItem value="5">1:5</SelectItem>
                <SelectItem value="10">1:10</SelectItem>
                <SelectItem value="20">1:20</SelectItem>
                <SelectItem value="50">1:50</SelectItem>
                <SelectItem value="100">1:100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin">Margin (USD)</Label>
            <Input
              id="margin"
              type="number"
              min="1"
              step="0.01"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="Enter margin"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={openTradeMutation.isPending}
          >
            {openTradeMutation.isPending ? 'Opening Trade...' : 'Open Trade'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
