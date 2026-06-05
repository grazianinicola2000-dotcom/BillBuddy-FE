import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GroupBalanceSummaryDTO } from "../types"

interface Props {
  summary?: GroupBalanceSummaryDTO
}

function BalanceSummaryCard({ summary }: Props) {
  if (!summary) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Expenses</p>

          <p className="text-xl font-bold">
            {summary.totalExpenses} {summary.currencyCode}
          </p>
        </div>

        <div className="border-t pt-4">
          {summary.netBalances.map((balance) => (
            <div key={balance.userId} className="flex justify-between py-2">
              <span>{balance.username}</span>

              <span
                className={
                  balance.netBalance >= 0
                    ? "font-semibold text-green-600"
                    : "font-semibold text-red-600"
                }
              >
                {balance.netBalance} {balance.currencyCode}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BalanceSummaryCard
