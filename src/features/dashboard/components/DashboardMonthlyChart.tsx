import { useMemo } from "react"
import type { ExpenseDTO } from "@/features/expenses/types"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

interface Props {
  expenses: ExpenseDTO[]
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function DashboardMonthlyChart({ expenses }: Props) {
  const monthlyData = useMemo(() => {
    const monthlyTotals: Record<string, number> = {}

    MONTHS.forEach((month) => {
      monthlyTotals[month] = 0
    })

    expenses.forEach((expense) => {
      const date = new Date(expense.expenseDate)

      const month = date.toLocaleDateString("en-US", {
        month: "short",
      })

      monthlyTotals[month] += expense.totalAmount
    })

    return MONTHS.map((month) => ({
      month,
      amount: monthlyTotals[month],
    }))
  }, [expenses])

  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DashboardMonthlyChart
