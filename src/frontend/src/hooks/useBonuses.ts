import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Bonus, BonusType } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export function useGetUserBonuses() {
  const { actor, isFetching } = useActor();

  return useQuery<Bonus[]>({
    queryKey: ['userBonuses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserBonuses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBonuses() {
  const { actor, isFetching } = useActor();

  return useQuery<Bonus[]>({
    queryKey: ['allBonuses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBonuses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApplyBonus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      targetUser,
      amount,
      bonusType,
      description
    }: {
      targetUser: string;
      amount: number;
      bonusType: BonusType;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(targetUser);
      return actor.applyBonus(principal, amount, bonusType, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBonuses'] });
      queryClient.invalidateQueries({ queryKey: ['userBonuses'] });
      toast.success('Bonus applied successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to apply bonus');
    }
  });
}
