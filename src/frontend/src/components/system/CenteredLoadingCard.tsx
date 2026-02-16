import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface CenteredLoadingCardProps {
  message?: string;
}

export default function CenteredLoadingCard({ 
  message = 'Loading...' 
}: CenteredLoadingCardProps) {
  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
