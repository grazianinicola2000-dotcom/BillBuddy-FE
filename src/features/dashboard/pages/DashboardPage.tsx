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
import DashboardCategoryChart from "../components/DashboardCategoryChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardMonthlyChart from "../components/DashboardMonthlyChart"
import TopCategoriesCard from "../components/TopCategoriesCard"
import TopGroupsChart from "../components/TopGroupChart"

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

  const allExpenses = [
    ...(personalExpenses?.content ?? []),
    ...(myGroupExpenses?.content ?? []),
  ]

  const expensesByCategory = allExpenses.reduce(
    (acc, expense) => {
      const category = expense.categoryName ?? "Uncategorized"
      acc[category] = (acc[category] || 0) + expense.totalAmount
      return acc
    },
    {} as Record<string, number>
  )

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  const pieData = Object.entries(expensesByCategory).map(
    ([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length],
    })
  )

  const topCategories = [...pieData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const groupTotals = (myGroupExpenses?.content ?? []).reduce(
    (acc, expense) => {
      const group = expense.groupName ?? "Unknown"
      acc[group] = (acc[group] ?? 0) + expense.totalAmount
      return acc
    },
    {} as Record<string, number>
  )

  const topGroups = Object.entries(groupTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardCategoryChart data={pieData} />
            <TopCategoriesCard data={topCategories} />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Expenses Over Time</CardTitle>
        </CardHeader>

        <CardContent>
          <TopGroupsChart data={topGroups} />
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Top Groups</CardTitle>
        </CardHeader>

        <CardContent>
          <DashboardMonthlyChart expenses={allExpenses} />
        </CardContent>
      </Card>
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
