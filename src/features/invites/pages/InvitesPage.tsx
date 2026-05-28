import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  acceptInvite,
  declineInvite,
  fetchMyInvites,
  fetchSentInvites,
  cancelInvite,
} from "../InviteSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/layout/Navbar"
import { toast } from "sonner"

function InvitesPage() {
  const dispatch = useAppDispatch()
  const { invites, sentInvites, loading, error } = useAppSelector(
    (state) => state.invites
  )
  useEffect(() => {
    dispatch(fetchMyInvites())
    dispatch(fetchSentInvites())
  }, [dispatch])

  if (loading) {
    return <p className="p-6">Loading invites...</p>
  }
  if (error) {
    return <p className="p-6 text-red-500">Error: {error}</p>
  }
  return (
    <>
      <Navbar />
      <div className="p-6">
        <Tabs defaultValue="received" className="space-y-4">
          <TabsList>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
          <TabsContent value="received">
            <div className="space-y-4">
              {invites?.content.map((invite) => (
                <Card key={invite.inviteId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{invite.groupName}</CardTitle>
                      <Badge>{invite.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p>
                          Invited by:{" "}
                          <span className="font-semibold">
                            {invite.invitedByUsername}
                          </span>
                        </p>
                      </div>
                      {invite.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            onClick={async () => {
                              try {
                                await dispatch(
                                  acceptInvite(invite.inviteId)
                                ).unwrap()
                                toast.success("Invite accepted!")
                              } catch (error) {
                                toast.error(String(error))
                              }
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              try {
                                await dispatch(
                                  declineInvite(invite.inviteId)
                                ).unwrap()
                                toast.success("Invite declined!")
                              } catch (error) {
                                toast.error(String(error))
                              }
                            }}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="sent">
            <div className="space-y-4">
              {sentInvites?.content.map((invite) => (
                <Card key={invite.inviteId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{invite.groupName}</CardTitle>
                      <Badge>{invite.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p>
                          Sent to:{" "}
                          <span className="font-semibold">
                            {invite.receiverUsername}
                          </span>
                        </p>
                      </div>
                      {invite.status === "PENDING" && (
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            try {
                              await dispatch(
                                cancelInvite(invite.inviteId)
                              ).unwrap()
                              toast.success("Invite cancelled!")
                            } catch (error) {
                              toast.error(String(error))
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default InvitesPage
