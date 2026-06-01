import { Card, CardContent } from "@/components/ui/card"

interface Props {
  title: string
  value: string
  valueClassName?: string
}

function DashboardStatCard({ title, value, valueClassName }: Props) {
  return (
    <Card>
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
