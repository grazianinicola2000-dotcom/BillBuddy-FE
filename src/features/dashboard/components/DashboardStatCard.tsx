import { Card, CardContent } from "@/components/ui/card"

interface Props {
  title: string
  value: string
  valueClassName?: string
  className?: string
}

function DashboardStatCard({ title, value, valueClassName, className }: Props) {
  return (
    <Card
      className={`shadow-md transition-shadow hover:shadow-lg ${className ?? ""}`}
    >
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`mt-2 text-2xl font-bold ${valueClassName ?? ""}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

export default DashboardStatCard
