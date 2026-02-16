import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DepositRequest } from '../backend';
import { toast } from 'sonner';

export function useDepositFunds() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, mpesaRef }: { amount: number; mpesaRef: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.depositFunds(amount, mpesaRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depositStatus'] });
      queryClient.invalidateQueries({ queryKey: ['availableBalance'] });
      toast.success('Deposit request submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit deposit request');
    }
  });
}

export function useWithdrawFunds() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.withdrawFunds(amount);
    },
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['availableBalance'] });
        toast.success('Withdrawal processed successfully');
      } else {
        toast.error('Insufficient funds for withdrawal');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to process withdrawal');
    }
  });
}

export function useGetDepositStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<DepositRequest[]>({
    queryKey: ['depositStatus'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDepositStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllDepositRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<DepositRequest[]>({
    queryKey: ['allDepositRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDepositRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMpesaNumber() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['mpesaNumber'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMpesaNumber();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, adminNote }: { requestId: bigint; adminNote: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveDeposit(requestId, adminNote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDepositRequests'] });
      queryClient.invalidateQueries({ queryKey: ['depositStatus'] });
      toast.success('Deposit approved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve deposit');
    }
  });
}

export function useRejectDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, adminNote }: { requestId: bigint; adminNote: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectDeposit(requestId, adminNote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDepositRequests'] });
      queryClient.invalidateQueries({ queryKey: ['depositStatus'] });
      toast.success('Deposit rejected');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject deposit');
    }
  });
}
