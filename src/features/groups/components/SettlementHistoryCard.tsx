import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SettlementDTO } from "@/features/expenses/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  settlements: SettlementDTO[]
}

function SettlementHistoryCard({ settlements }: Props) {
  const sortedSettlements = [...settlements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settlement History</CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-64">
          <div className="pr-4">
            {sortedSettlements.length === 0 ? (
              <p className="text-muted-foreground">No settlements yet</p>
            ) : (
              <div className="space-y-3">
                {sortedSettlements.map((settlement) => (
                  <div
                    key={settlement.settlementId}
                    className="rounded-lg border p-3"
                  >
                    <p className="font-medium">
                      {settlement.payerUsername}
                      {" → "}
                      {settlement.receiverUsername}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {new Date(settlement.createdAt).toLocaleDateString()}
                    </p>

                    <p className="font-semibold">
                      {settlement.amount} {settlement.currencyCode}
                    </p>

                    {settlement.note && (
                      <p className="text-sm text-muted-foreground">
                        {settlement.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default SettlementHistoryCard
