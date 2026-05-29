import type { ExpenseDTO } from "../types"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Props {
  expense: ExpenseDTO
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ExpenseDetailsDialog({ expense, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{expense.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {expense.description && (
            <p className="text-muted-foreground">{expense.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {expense.categoryName && (
              <Badge variant="secondary">{expense.categoryName}</Badge>
            )}
            <Badge variant="outline">{expense.currencyCode}</Badge>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-semibold">
                {expense.totalAmount} {expense.currencyCode}
              </span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Paid By</span>
              <span>{expense.paidByUsername}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Date</span>
              <span>{new Date(expense.expenseDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Participants</h3>
          <div className="space-y-3">
            {expense.splits.map((split) => (
              <div
                key={split.expenseSplitId}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{split.username}</p>
                </div>
                <div className="text-right">
                  <p>Owed: {split.amountOwed}</p>
                  <p>Paid: {split.amountPaid}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExpenseDetailsDialog
