import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OptimizedPaymentDTO } from "../types"

interface Props {
  payments: OptimizedPaymentDTO[]
}

function SuggestedPaymentsCard({ payments }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-muted-foreground">No suggested payments</p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.formUserId + payment.toUserId}
              className="flex items-center justify-between py-2"
            >
              <span>
                {payment.fromUsername}
                {" → "}
                {payment.toUsername}
              </span>
              <span>
                {payment.amount} {payment.currencyCode}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default SuggestedPaymentsCard
