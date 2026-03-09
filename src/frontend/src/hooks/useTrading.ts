import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TradeDirection, TradePosition } from "../backend";
import { normalizeTradeError } from "../utils/canisterError";
import { useActor } from "./useActor";

export function useOpenTrade() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pairSymbol,
      direction,
      leverage,
      margin,
    }: {
      pairSymbol: string;
      direction: TradeDirection;
      leverage: bigint;
      margin: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.openTrade(pairSymbol, direction, leverage, margin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openTrades"] });
      queryClient.invalidateQueries({ queryKey: ["tradeHistory"] });
      queryClient.invalidateQueries({ queryKey: ["availableBalance"] });
      toast.success("Trade opened successfully");
    },
    onError: (error: unknown) => {
      const userMessage = normalizeTradeError(error);
      toast.error(userMessage);
    },
  });
}

export function useCloseTrade() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tradeId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.closeTrade(tradeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openTrades"] });
      queryClient.invalidateQueries({ queryKey: ["tradeHistory"] });
      queryClient.invalidateQueries({ queryKey: ["availableBalance"] });
      toast.success("Trade closed successfully");
    },
    onError: (error: unknown) => {
      const userMessage = normalizeTradeError(error);
      toast.error(userMessage);
    },
  });
}

export function useGetOpenTrades() {
  const { actor, isFetching } = useActor();

  return useQuery<TradePosition[]>({
    queryKey: ["openTrades"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOpenTrades();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTradeHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<TradePosition[]>({
    queryKey: ["tradeHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTradeHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTrades() {
  const { actor, isFetching } = useActor();

  return useQuery<TradePosition[]>({
    queryKey: ["allTrades"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTrades();
    },
    enabled: !!actor && !isFetching,
  });
}
