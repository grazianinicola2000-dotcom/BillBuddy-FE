import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import type { GroupDTO } from "../types"

interface GroupCardProps {
  group: GroupDTO
}

function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate()
  return (
    <Card
      className="cursor-pointer transition hover:bg-muted/40"
      onClick={() => navigate(`/groups/${group.groupId}`)}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={group.imageUrl || undefined} alt={group.name} />
          <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <CardTitle className="truncate">{group.name}</CardTitle>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {group.description}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Created at: {new Date(group.createdAt).toLocaleDateString()}{" "}
        </p>
      </CardContent>
    </Card>
  )
}

export default GroupCard
