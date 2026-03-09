import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp } from "lucide-react";
import { INSTRUMENTS } from "../../config/instruments";

interface InstrumentWatchlistProps {
  selectedInstrument: string;
  onInstrumentChange: (instrument: string) => void;
}

export default function InstrumentWatchlist({
  selectedInstrument,
  onInstrumentChange,
}: InstrumentWatchlistProps) {
  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm h-[600px] flex flex-col">
      <CardHeader className="py-4 pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Markets
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pt-0 pb-4 overflow-hidden">
        <ScrollArea className="h-full pr-3">
          <div className="space-y-1">
            {INSTRUMENTS.map((instrument) => (
              <Button
                key={instrument.symbol}
                variant={
                  selectedInstrument === instrument.symbol
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => onInstrumentChange(instrument.symbol)}
              >
                <div className="flex flex-col items-start gap-1 w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">
                      {instrument.symbol}
                    </span>
                    {instrument.isSimulated && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 h-4"
                      >
                        SIM
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {instrument.name}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
