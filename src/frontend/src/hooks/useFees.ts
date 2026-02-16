import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TradingFee } from '../backend';
import { toast } from 'sonner';

export function useGetTradingFees() {
  const { actor, isFetching } = useActor();

  return useQuery<TradingFee[]>({
    queryKey: ['tradingFees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTradingFees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTradingFees() {
  const { actor, isFetching } = useActor();

  return useQuery<TradingFee[]>({
    queryKey: ['allTradingFees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTradingFees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPlatformRevenue() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['platformRevenue'],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getPlatformRevenue();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitTradingFee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tradeId, amount }: { tradeId: bigint; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitTradingFee(tradeId, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tradingFees'] });
      queryClient.invalidateQueries({ queryKey: ['allTradingFees'] });
      queryClient.invalidateQueries({ queryKey: ['platformRevenue'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit trading fee');
    }
  });
}
