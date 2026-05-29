import { useAppDispatch } from "@/app/hooks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getErrorMessage } from "@/lib/errorUtils"
import { toast } from "sonner"
import type { GroupDetailsDTO } from "@/features/groups/types"
import type { UserDTO } from "@/features/auth/types"

import {
  demoteMember,
  fetchGroupDetails,
  promoteMember,
  removeMember,
} from "@/features/groups/groupSlice"

interface Props {
  group: GroupDetailsDTO
  currentUser: UserDTO | null
}

function MembersCard({ group, currentUser }: Props) {
  const dispatch = useAppDispatch()

  const currentMember = group.members.find(
    (member) => member.userId === currentUser?.userId
  )

  const isOwner = currentMember?.role === "OWNER"

  const refreshGroup = () => {
    dispatch(fetchGroupDetails(group.groupId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members ({group.memberCount})</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {group.members.map((member) => (
          <div
            key={member.groupMemberId}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.avatarUrl || undefined} />

                <AvatarFallback>
                  {member.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">{member.username}</p>

                <p className="text-sm text-muted-foreground">
                  Joined: {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={member.role === "OWNER" ? "default" : "secondary"}
              >
                {member.role}
              </Badge>

              {isOwner && member.userId !== currentUser?.userId && (
                <>
                  {member.role === "MEMBER" ? (
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await dispatch(
                            promoteMember({
                              groupId: group.groupId,
                              userId: member.userId,
                            })
                          ).unwrap()

                          refreshGroup()
                        } catch (error) {
                          toast.error(getErrorMessage(error))
                        }
                      }}
                    >
                      Promote
                    </Button>
                  ) : (
                    member.role === "ADMIN" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await dispatch(
                              demoteMember({
                                groupId: group.groupId,
                                userId: member.userId,
                              })
                            ).unwrap()

                            refreshGroup()
                          } catch (error) {
                            toast.error(getErrorMessage(error))
                          }
                        }}
                      >
                        Demote
                      </Button>
                    )
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      try {
                        await dispatch(
                          removeMember({
                            groupId: group.groupId,
                            userId: member.userId,
                          })
                        ).unwrap()

                        refreshGroup()
                      } catch (error) {
                        toast.error(getErrorMessage(error))
                      }
                    }}
                  >
                    Remove
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default MembersCard
