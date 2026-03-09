import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BonusType, TradeDirection, UserProfile } from "../backend";
import { useActor } from "./useActor";

// This file manages all React Query calls to the backend and state invalidation

export function useGetAllData() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
