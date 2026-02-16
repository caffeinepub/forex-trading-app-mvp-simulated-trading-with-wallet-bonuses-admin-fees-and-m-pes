import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { UserRole } from '../../backend';
import { toast } from 'sonner';
import { APP_NAME } from '../../config/branding';

export default function ProfileSetupDialog() {
  const [displayName, setDisplayName] = useState('');
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile({
        displayName,
        role: UserRole.user,
        walletBalance: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile created successfully!');
    },
    onError: (error: Error) => {
      console.error('Profile creation error:', error);
      toast.error(error.message || 'Failed to create profile');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      saveMutation.mutate();
    }
  };

  const handleRetry = () => {
    saveMutation.reset();
    if (displayName.trim()) {
      saveMutation.mutate();
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md border-primary/20 shadow-premium" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to {APP_NAME}!</DialogTitle>
          <DialogDescription>
            Please enter your display name to get started with simulated forex trading.
          </DialogDescription>
        </DialogHeader>
        
        {saveMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {saveMutation.error?.message || 'Failed to create profile. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
              disabled={saveMutation.isPending}
              className="border-border/50 focus:border-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 shadow-glow-gold" 
              disabled={saveMutation.isPending || !displayName.trim()}
            >
              {saveMutation.isPending ? 'Creating Profile...' : 'Get Started'}
            </Button>
            
            {saveMutation.isError && (
              <Button 
                type="button"
                variant="outline"
                onClick={handleRetry}
                disabled={saveMutation.isPending || !displayName.trim()}
              >
                Retry
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
