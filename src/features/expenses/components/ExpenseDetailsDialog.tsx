import type { ExpenseDTO } from "../types"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/app/hooks"
import { deleteExpense } from "../expenseSlice"
import { toast } from "sonner"
import {
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"

interface Props {
  expense: ExpenseDTO
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ExpenseDetailsDialog({ expense, open, onOpenChange }: Props) {
  const dispatch = useAppDispatch()

  const handleDelete = async () => {
    try {
      await dispatch(deleteExpense(expense.expenseId)).unwrap()

      toast.success("Expense deleted")

      onOpenChange(false)
    } catch (error) {
      toast.error(String(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm lg:max-w-lg">
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Expense</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Expense</AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. The expense will be permanently
                deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}

export default ExpenseDetailsDialog
