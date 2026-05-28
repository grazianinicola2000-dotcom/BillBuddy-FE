import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchGroupDetails } from "../groupSlice"
import Navbar from "@/components/layout/Navbar"
import InviteMemberDialog from "../components/InviteMemberDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function GroupDetailsPage() {
  const { groupId } = useParams()

  const dispatch = useAppDispatch()

  const { selectedGroup, loading, error } = useAppSelector(
    (state) => state.groups
  )

  const currentUser = useAppSelector((state) => state.auth.user)
  const currentMember = selectedGroup?.members.find(
    (member) => member.userId === currentUser?.userId
  )
  const canInviteMembers =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN"

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupDetails(groupId))
    }
  }, [dispatch, groupId])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6">Loading group details...</div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-red-500">{error}</div>
      </>
    )
  }

  if (!selectedGroup) {
    return (
      <>
        <Navbar />
        <div className="p-6">Group not found</div>
      </>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={selectedGroup.imageUrl || undefined} />
              <AvatarFallback className="text-2xl">
                {selectedGroup.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-4">
                <CardTitle className="text-3xl">{selectedGroup.name}</CardTitle>
                {canInviteMembers && (
                  <InviteMemberDialog groupId={selectedGroup.groupId} />
                )}
              </div>
              <p className="mt-2 text-muted-foreground">
                {selectedGroup.description}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Created at:{" "}
                {new Date(selectedGroup.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members ({selectedGroup.memberCount})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedGroup.members.map((member) => (
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
                <Badge
                  variant={member.role === "OWNER" ? "default" : "secondary"}
                >
                  {member.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GroupDetailsPage
