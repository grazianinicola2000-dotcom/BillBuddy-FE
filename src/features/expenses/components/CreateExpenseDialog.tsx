import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  createExpense,
  fetchCategories,
  fetchGroupExpenses,
  fetchPersonalExpenses,
} from "../expenseSlice"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errorUtils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { GroupMemberDTO } from "@/features/groups/types"
import type { CurrencyCode } from "../types"

interface Props {
  groupId?: string
  members?: GroupMemberDTO[]
}

function CreateExpenseDialog({ groupId, members }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("EUR")
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const dispatch = useAppDispatch()
  const { categories } = useAppSelector((state) => state.expenses)
  const currentUser = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const isGroupExpense = !!groupId

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const participantIds = isGroupExpense
        ? selectedParticipants
        : [currentUser!.userId]
      await dispatch(
        createExpense({
          title,
          description,
          totalAmount: Number(totalAmount),
          groupId,
          categoryId: categoryId || undefined,
          currencyCode,
          expenseDate,
          participantIds,
        })
      ).unwrap()
      toast.success("Expense created successfully!")
      if (groupId) {
        dispatch(fetchGroupExpenses(groupId))
        setOpen(false)
      } else {
        dispatch(fetchPersonalExpenses())
        setOpen(false)
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm lg:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isGroupExpense ? "Add Group Expense" : "Add Personal Expense"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Dinner, Rent, Groceries..."
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={totalAmount}
                onChange={(event) => setTotalAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={currencyCode}
                onValueChange={(value) =>
                  setCurrencyCode(value as CurrencyCode)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category.expenseCategoryId}
                    value={category.expenseCategoryId}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Expense Date</Label>
            <Input
              type="date"
              value={expenseDate}
              onChange={(event) => setExpenseDate(event.target.value)}
            />
          </div>
          {isGroupExpense && (
            <Card className="space-y-3 p-4">
              <Label>Participants</Label>
              <div className="space-y-2">
                {members?.map((member) => (
                  <label
                    key={member.userId}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(member.userId)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setSelectedParticipants((prev) => [
                            ...prev,
                            member.userId,
                          ])
                        } else {
                          setSelectedParticipants((prev) =>
                            prev.filter((id) => id !== member.userId)
                          )
                        }
                      }}
                    />
                    <span>{member.username}</span>
                  </label>
                ))}
              </div>
            </Card>
          )}
          <Button type="submit" className="w-full">
            Create Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateExpenseDialog
