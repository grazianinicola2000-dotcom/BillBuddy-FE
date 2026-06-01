import { useAppDispatch, useAppSelector } from "@/app/hooks"
import Navbar from "@/components/layout/Navbar"
import { fetchGlobalSummary } from "@/features/expenses/balanceSlice"
import {
  fetchMyGroupExpenses,
  fetchPersonalExpenses,
} from "@/features/expenses/expenseSlice"
import { useEffect } from "react"
import DashboardStatCard from "../components/DashboardStatCard"
import ExpenseCard from "@/features/expenses/components/ExpenseCard"

function DashboardPage() {
  const dispatch = useAppDispatch()
  const { personalExpenses, myGroupExpenses } = useAppSelector(
    (state) => state.expenses
  )
  const { globalSummary } = useAppSelector((state) => state.balances)

  useEffect(() => {
    dispatch(fetchPersonalExpenses())
    dispatch(fetchMyGroupExpenses())
    dispatch(fetchGlobalSummary())
  }, [dispatch])

  const totalPersonalExpenses =
    personalExpenses?.content.reduce(
      (sum, expense) => sum + expense.totalAmount,
      0
    ) ?? 0

  const totalGroupExpenses =
    myGroupExpenses?.content.reduce(
      (sum, expense) => sum + expense.totalAmount,
      0
    ) ?? 0

  const summary = globalSummary?.[0]

  const actualMoneySpent = summary
    ? summary.totalSpent - summary.totalToReceive + summary.totalOwed
    : 0

  const recentExpenses = [
    ...(personalExpenses?.content ?? []),
    ...(myGroupExpenses?.content ?? []),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  return (
    <>
      <Navbar />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <DashboardStatCard
          title="Personal Expenses"
          value={`${totalPersonalExpenses} €`}
        />
        <DashboardStatCard
          title="Group Expenses"
          value={`${totalGroupExpenses} €`}
        />
        <DashboardStatCard
          title="You Owe"
          value={`${summary?.totalOwed ?? "0.00"} €`}
        />
        <DashboardStatCard
          title="To Receive"
          value={`${summary?.totalToReceive ?? "0.00"} €`}
        />
        <DashboardStatCard
          title="Actual Money Spent"
          value={`${actualMoneySpent.toFixed(2)} €`}
        />
        <DashboardStatCard
          title="Net Balance"
          value={`${summary?.netBalance ?? "0.00"} €`}
          valueClassName={
            (summary?.netBalance ?? 0) >= 0 ? "text-green-500" : "text-red-500"
          }
        />
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Recent Expenses</h2>

        <div className="space-y-4">
          {recentExpenses.map((expense) => (
            <ExpenseCard key={expense.expenseId} expense={expense} />
          ))}
        </div>
      </div>
    </>
  )
}

export default DashboardPage
