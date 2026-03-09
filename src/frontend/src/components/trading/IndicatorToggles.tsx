import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

interface IndicatorTogglesProps {
  indicators: {
    ma: boolean;
    rsi: boolean;
    macd: boolean;
  };
  onToggle: (indicator: "ma" | "rsi" | "macd") => void;
}

export default function IndicatorToggles({
  indicators,
  onToggle,
}: IndicatorTogglesProps) {
  return (
    <div className="flex items-center gap-2">
      <Activity className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">Indicators:</span>
      <div className="flex gap-1">
        <Button
          variant={indicators.ma ? "secondary" : "outline"}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => onToggle("ma")}
        >
          MA
        </Button>
        <Button
          variant={indicators.rsi ? "secondary" : "outline"}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => onToggle("rsi")}
        >
          RSI
        </Button>
        <Button
          variant={indicators.macd ? "secondary" : "outline"}
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => onToggle("macd")}
        >
          MACD
        </Button>
      </div>
    </div>
  );
}
