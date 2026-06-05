import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchGlobalSummary } from "@/features/expenses/balanceSlice"
import {
  fetchMyGroupExpenses,
  fetchPersonalExpenses,
} from "@/features/expenses/expenseSlice"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import DashboardStatCard from "../components/DashboardStatCard"
import DashboardCategoryChart from "../components/DashboardCategoryChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardMonthlyChart from "../components/DashboardMonthlyChart"
import TopCategoriesCard from "../components/TopCategoriesCard"
import TopGroupsChart from "../components/TopGroupChart"
import PageLayout from "@/components/layout/PageLayout"
import RecentExpenseCard from "../components/RecentExpenseCard"

function DashboardPage() {
  const dispatch = useAppDispatch()

  const currentYear = new Date().getFullYear()

  const { personalExpenses, myGroupExpenses } = useAppSelector(
    (state) => state.expenses
  )
  const { globalSummary } = useAppSelector((state) => state.balances)

  const [selectedYear, setSelectedYear] = useState(currentYear)

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

  const filteredExpenses = allExpenses.filter(
    (expense) => new Date(expense.expenseDate).getFullYear() === selectedYear
  )

  const availableYears = [
    ...new Set(
      allExpenses.map((expense) => new Date(expense.expenseDate).getFullYear())
    ),
  ]
  if (!availableYears.includes(currentYear)) {
    availableYears.push(currentYear)
  }
  availableYears.sort((a, b) => b - a)

  const expensesByCategory = filteredExpenses.reduce(
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

  const groupTotals = filteredExpenses
    .filter((expense) => expense.expenseType === "GROUP")
    .reduce(
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
    <PageLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
          <DashboardStatCard
            className="order-md-1 order-1"
            title="Personal Expenses"
            value={`${totalPersonalExpenses} €`}
          />
          <DashboardStatCard
            className="order-md-3 order-2"
            title="Group Expenses"
            value={`${totalGroupExpenses} €`}
          />
          <DashboardStatCard
            className="order-md-2 order-3"
            title="Effective Spending"
            value={`${actualMoneySpent.toFixed(2)} €`}
          />
          <DashboardStatCard
            className="order-md-4 order-4"
            title="To Receive"
            value={`${summary?.totalToReceive ?? "0.00"} €`}
          />
          <DashboardStatCard
            className="order-md-6 order-5"
            title="You Owe"
            value={`${summary?.totalOwed ?? "0.00"} €`}
          />
          <DashboardStatCard
            className="order-md-5 order-6"
            title="Net Balance"
            value={`${summary?.netBalance ?? "0.00"} €`}
            valueClassName={
              (summary?.netBalance ?? 0) >= 0
                ? "text-green-500"
                : "text-red-500"
            }
          />
        </div>

        <Card className="mt-8 shadow-md transition-shadow hover:shadow-lg">
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

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <Card className="mt-8 shadow-md transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Top Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <TopGroupsChart data={topGroups} />
            </CardContent>
          </Card>

          <Card className="mt-8 shadow-md transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Expenses Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardMonthlyChart expenses={filteredExpenses} />
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8 shadow-md transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentExpenses.map((expense) => (
              <RecentExpenseCard key={expense.expenseId} expense={expense} />
            ))}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

export default DashboardPage
