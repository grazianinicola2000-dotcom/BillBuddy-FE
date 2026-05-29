import type { ExpenseDTO } from "../types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ExpenseDetailsDialog from "./ExpenseDetailsDialog"
import { useState } from "react"

interface Props {
  expense: ExpenseDTO
}

function ExpenseCard({ expense }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Card
        className="cursor-pointer transition hover:shadow-md"
        onClick={() => setOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{expense.title}</h3>
              {expense.description && (
                <p className="text-sm text-muted-foreground">
                  {expense.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                {expense.totalAmount} {expense.currencyCode}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {expense.categoryId && (
              <Badge variant="secondary">{expense.categoryName}</Badge>
            )}
            {expense.splits.map((split) => (
              <Badge key={split.expenseSplitId} variant="outline">
                {split.username}
              </Badge>
            ))}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Paid by {expense.paidByUsername}
            {" • "}
            {new Date(expense.expenseDate).toLocaleDateString()}
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

export default ExpenseCard
