import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, RefreshCw } from "lucide-react";

interface ChartControlsProps {
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  refreshRate: number;
  onRefreshRateChange: (rate: number) => void;
}

const TIMEFRAMES = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
];

const REFRESH_RATES = [
  { value: 1000, label: "1s" },
  { value: 2000, label: "2s" },
  { value: 3000, label: "3s" },
  { value: 5000, label: "5s" },
];

export default function ChartControls({
  timeframe,
  onTimeframeChange,
  refreshRate,
  onRefreshRateChange,
}: ChartControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="timeframe" className="text-xs text-muted-foreground">
          Timeframe
        </Label>
        <Select value={timeframe} onValueChange={onTimeframeChange}>
          <SelectTrigger id="timeframe" className="h-8 w-[110px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEFRAMES.map((tf) => (
              <SelectItem key={tf.value} value={tf.value} className="text-xs">
                {tf.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="refresh" className="text-xs text-muted-foreground">
          Refresh
        </Label>
        <Select
          value={refreshRate.toString()}
          onValueChange={(v) => onRefreshRateChange(Number(v))}
        >
          <SelectTrigger id="refresh" className="h-8 w-[80px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REFRESH_RATES.map((rate) => (
              <SelectItem
                key={rate.value}
                value={rate.value.toString()}
                className="text-xs"
              >
                {rate.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
