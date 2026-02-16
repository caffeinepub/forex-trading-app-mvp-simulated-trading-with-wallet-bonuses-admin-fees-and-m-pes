import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useGetMpesaNumber } from '@/hooks/useWallet';

interface MpesaInstructionsCardProps {
  type: 'deposit' | 'withdrawal';
}

export default function MpesaInstructionsCard({ type }: MpesaInstructionsCardProps) {
  const { data: mpesaNumber, isLoading, isError } = useGetMpesaNumber();

  const displayNumber = isLoading 
    ? 'Loading...' 
    : isError 
    ? 'Contact support for payment details' 
    : mpesaNumber || 'Contact support for payment details';

  return (
    <Alert className="border-primary/50 bg-primary/5">
      <Info className="h-4 w-4" />
      <AlertDescription className="text-sm">
        {type === 'deposit' ? (
          <>
            <strong>M-Pesa Deposit Instructions:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Send funds via M-Pesa to <strong className="text-primary">{displayNumber}</strong></li>
              <li>Note your transaction code (e.g., QA12BC3D4E)</li>
              <li>Enter the code and your phone number below</li>
              <li>Admin will review and approve your deposit</li>
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              Note: This is a manual process. Funds are not automatically charged.
            </p>
          </>
        ) : (
          <>
            <strong>M-Pesa Withdrawal Instructions:</strong>
            <p className="mt-2">
              Enter your M-Pesa phone number. Admin will manually process your withdrawal request 
              and send funds to your number.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Note: Withdrawals are processed manually and may take 1-2 business days.
            </p>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
