import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { normalizeQuoteError } from "../utils/canisterError";
import { useActor } from "./useActor";

export function useQuotePolling(symbol: string, interval = 2000) {
  const { actor } = useActor();
  const [quote, setQuote] = useState<number | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorShownRef = useRef<boolean>(false);

  useEffect(() => {
    if (!actor || !symbol) {
      setQuote(null);
      setError(null);
      errorShownRef.current = false;
      return;
    }

    const fetchQuote = async () => {
      try {
        const price = await actor.getQuote(symbol);

        // Backend returns 0.0 for unsupported symbols
        if (price === 0.0) {
          const errorMsg = "Quote unavailable for this instrument";
          setError(errorMsg);
          setQuote(null);

          // Show toast only once per symbol
          if (!errorShownRef.current) {
            toast.error(errorMsg);
            errorShownRef.current = true;
          }
        } else {
          setQuote(price);
          setError(null);
          errorShownRef.current = false;
        }
      } catch (err) {
        const errorMsg = normalizeQuoteError(err);
        setError(errorMsg);
        setQuote(null);

        // Show toast only once per symbol
        if (!errorShownRef.current) {
          toast.error(errorMsg);
          errorShownRef.current = true;
        }
      }
    };

    // Initial fetch
    fetchQuote();
    setIsPolling(true);

    // Set up polling
    intervalRef.current = setInterval(fetchQuote, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPolling(false);
      setError(null);
      errorShownRef.current = false;
    };
  }, [actor, symbol, interval]);

  return { quote, isPolling, error };
}
