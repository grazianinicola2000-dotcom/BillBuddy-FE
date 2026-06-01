import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface Props {
  data: {
    name: string
    value: number
  }[]
}

function DashboardCategoryChart({ data }: Props) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DashboardCategoryChart
