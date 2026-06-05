import { useEffect, useState } from "react"
import { useAppDispatch } from "@/app/hooks"
import { createSettlement } from "../expenseSlice"
import type { SplitBalanceDTO } from "../types"
import { getErrorMessage } from "@/lib/errorUtils"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Props {
  debt: SplitBalanceDTO
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function SettlementDialog({ debt, open, onOpenChange, onSuccess }: Props) {
  const dispatch = useAppDispatch()

  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    setAmount(debt.remainingDebt.toString())
  }, [debt])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      await dispatch(
        createSettlement({
          expenseSplitId: debt.expenseSplitId,

          amount: Number(amount),

          currencyCode: debt.currencyCode,

          note,
        })
      ).unwrap()

      toast.success("Settlement recorded successfully!")
      onSuccess?.()

      onOpenChange(false)

      setNote("")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settle Debt</DialogTitle>
          <DialogDescription>{debt.expenseTitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">Creditor</p>
            <p className="font-medium">{debt.creditorUsername}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm text-muted-foreground">Remaining Debt</p>
            <p className="font-medium">
              {debt.remainingDebt} {debt.currencyCode}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
            />
          </div>
          <Button type="submit" className="w-full">
            Confirm Settlement
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SettlementDialog
