import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchPersonalExpenses } from "../expenseSlice"
import CreateExpenseDialog from "../components/CreateExpenseDialog"
import ExpenseCard from "../components/ExpenseCard"
import PageLayout from "@/components/layout/PageLayout"
import DashboardStatCard from "@/features/dashboard/components/DashboardStatCard"

function PersonalExpensesPage() {
  const dispatch = useAppDispatch()

  const { personalExpenses, loading, error } = useAppSelector(
    (state) => state.expenses
  )

  useEffect(() => {
    dispatch(fetchPersonalExpenses())
  }, [dispatch])

  const expenses = personalExpenses?.content ?? []

  const totalSpent = expenses.reduce(
    (sum, expense) => sum + expense.totalAmount,
    0
  )

  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0

  return (
    <PageLayout>
      <div className="space-y-8 p-6">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <div className="grid gap-4 lg:grid-cols-3">
          <DashboardStatCard
            title="Total Spent"
            value={`${totalSpent.toFixed(2)} €`}
          />
          <DashboardStatCard title="Expenses" value={`${expenses.length}`} />
          <DashboardStatCard
            title="Average Expense"
            value={`${averageExpense.toFixed(2)} €`}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Personal Expenses</h1>
            <p className="text-muted-foreground">
              {expenses.length} expenses tracked
            </p>
          </div>
          <CreateExpenseDialog />
        </div>
        {loading && (
          <p className="text-muted-foreground">Loading expenses...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && expenses.length === 0 && (
          <div className="rounded-lg border p-12 text-center">
            <h3 className="text-lg font-semibold">No personal expenses yet</h3>

            <p className="mt-2 text-muted-foreground">
              Create your first expense to start tracking your spending.
            </p>
          </div>
        )}
        {!loading && expenses.length > 0 && (
          <div className="grid gap-4 xl:grid-cols-2">
            {expenses.map((expense) => (
              <ExpenseCard
                key={expense.expenseId}
                expense={expense}
                showPaidBy={false}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default PersonalExpensesPage
