import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  data: {
    name: string
    value: number
    fill: string
  }[]
}

function TopCategoriesCard({ data }: Props) {
  return (
    <Card className="mt-8 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle>Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((category, index) => (
            <div
              key={category.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: category.fill,
                  }}
                />
                <span>
                  {index + 1}. {category.name}
                </span>
              </div>
              <span>{category.value.toFixed(2)} €</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TopCategoriesCard
