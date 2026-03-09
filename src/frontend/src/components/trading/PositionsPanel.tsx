import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TradePosition } from "../../backend";
import OpenTradesTable from "./OpenTradesTable";
import TradeHistoryTable from "./TradeHistoryTable";

interface PositionsPanelProps {
  openTrades: TradePosition[];
  tradeHistory: TradePosition[];
}

export default function PositionsPanel({
  openTrades,
  tradeHistory,
}: PositionsPanelProps) {
  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="py-4">
        <CardTitle className="text-base">Positions & History</CardTitle>
        <CardDescription>
          Manage your open trades and view history
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="open" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="open">
              Open Trades ({openTrades.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({tradeHistory.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="open" className="mt-4">
            <OpenTradesTable trades={openTrades} />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <TradeHistoryTable trades={tradeHistory} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
