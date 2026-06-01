import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import Navbar from "@/components/layout/Navbar"
import { fetchPersonalExpenses } from "../expenseSlice"
import CreateExpenseDialog from "../components/CreateExpenseDialog"
import ExpenseCard from "../components/ExpenseCard"

function PersonalExpensesPage() {
  const dispatch = useAppDispatch()

  const { personalExpenses, loading, error } = useAppSelector(
    (state) => state.expenses
  )

  useEffect(() => {
    dispatch(fetchPersonalExpenses())
  }, [dispatch])

  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Personal Expenses</h1>
            <p className="text-muted-foreground">
              Manage your personal expenses
            </p>
          </div>
          <CreateExpenseDialog />
        </div>
        {loading && <p>Loading expenses...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && personalExpenses?.content.length === 0 && (
          <p className="text-muted-foreground">No personal expenses yet</p>
        )}
        <div className="space-y-4">
          {personalExpenses?.content.map((expense) => (
            <ExpenseCard
              key={expense.expenseId}
              expense={expense}
              showPaidBy={false}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default PersonalExpensesPage
