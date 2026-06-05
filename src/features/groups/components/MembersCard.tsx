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
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { MoreVertical } from "lucide-react"

interface Props {
  group: GroupDetailsDTO
  currentUser: UserDTO | null
}

function MembersCard({ group, currentUser }: Props) {
  const dispatch = useAppDispatch()

  const [selectedMember, setSelectedMember] = useState<
    GroupDetailsDTO["members"][number] | null
  >(null)

  const [action, setAction] = useState<"promote" | "demote" | "remove" | null>(
    null
  )

  const currentMember = group.members.find(
    (member) => member.userId === currentUser?.userId
  )

  const isOwner = currentMember?.role === "OWNER"

  const refreshGroup = () => {
    dispatch(fetchGroupDetails(group.groupId))
  }

  const handleConfirm = async () => {
    if (!selectedMember || !action) return

    try {
      switch (action) {
        case "promote":
          await dispatch(
            promoteMember({
              groupId: group.groupId,
              userId: selectedMember.userId,
            })
          ).unwrap()
          toast.success(`${selectedMember.username} promoted to admin`)
          break
        case "demote":
          await dispatch(
            demoteMember({
              groupId: group.groupId,
              userId: selectedMember.userId,
            })
          ).unwrap()
          toast.success(`${selectedMember.username} demoted to member`)
          break
        case "remove":
          await dispatch(
            removeMember({
              groupId: group.groupId,
              userId: selectedMember.userId,
            })
          ).unwrap()
          toast.success(`${selectedMember.username} removed from group`)
          break
      }
      refreshGroup()
      setSelectedMember(null)
      setAction(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
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
            className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {member.role === "MEMBER" && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member)
                            setAction("promote")
                          }}
                        >
                          Promote to Admin
                        </DropdownMenuItem>
                      )}

                      {member.role === "ADMIN" && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member)
                            setAction("demote")
                          }}
                        >
                          Demote to Member
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        className="text-red-500"
                        onClick={() => {
                          setSelectedMember(member)
                          setAction("remove")
                        }}
                      >
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      <AlertDialog
        open={action !== null}
        onOpenChange={() => {
          setAction(null)
          setSelectedMember(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "promote" && "Promote member?"}

              {action === "demote" && "Demote member?"}

              {action === "remove" && "Remove member?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {action === "promote" &&
                "This member will become an administrator of the group."}

              {action === "demote" &&
                "This member will lose administrator privileges."}

              {action === "remove" && "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirm}
              className={
                action === "remove" ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default MembersCard
