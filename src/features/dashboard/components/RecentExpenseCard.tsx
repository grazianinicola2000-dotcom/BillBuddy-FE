import type { ExpenseDTO } from "@/features/expenses/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ExpenseDetailsDialog from "@/features/expenses/components/ExpenseDetailsDialog"
import { useState } from "react"

interface Props {
  expense: ExpenseDTO
}

function RecentExpenseCard({ expense }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card
        className="cursor-pointer shadow-sm transition-shadow hover:shadow-md"
        onClick={() => setOpen(true)}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate font-medium">{expense.title}</h3>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                {expense.categoryName && (
                  <Badge variant="secondary">{expense.categoryName}</Badge>
                )}

                {expense.expenseType === "GROUP" && expense.groupName && (
                  <span className="text-xs text-muted-foreground">
                    {expense.groupName}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-semibold">
                {expense.totalAmount.toFixed(2)} {expense.currencyCode}
              </p>

              <p className="text-xs text-muted-foreground">
                {new Date(expense.expenseDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ExpenseDetailsDialog
        expense={expense}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

export default RecentExpenseCard
