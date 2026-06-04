import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  acceptInvite,
  declineInvite,
  fetchMyInvites,
  fetchSentInvites,
  cancelInvite,
} from "../InviteSlice"

import PageLayout from "@/components/layout/PageLayout"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import DashboardStatCard from "@/features/dashboard/components/DashboardStatCard"

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

  const receivedInvites = invites?.content ?? []
  const sent = sentInvites?.content ?? []

  const pendingReceived = receivedInvites.filter(
    (invite) => invite.status === "PENDING"
  ).length

  const pendingSent = sent.filter(
    (invite) => invite.status === "PENDING"
  ).length

  if (loading) {
    return (
      <PageLayout>
        <div className="p-6">Loading invites...</div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="p-6 text-red-500">Error: {error}</div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-3xl font-bold">Invitations</h1>

          <p className="text-muted-foreground">Manage your group invitations</p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 lg:grid-cols-3">
          <DashboardStatCard
            title="Received"
            value={`${receivedInvites.length}`}
          />

          <DashboardStatCard title="Sent" value={`${sent.length}`} />

          <DashboardStatCard
            title="Pending"
            value={`${pendingReceived + pendingSent}`}
          />
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList>
            <TabsTrigger value="received">Received</TabsTrigger>

            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>

          {/* RECEIVED */}
          <TabsContent value="received">
            {receivedInvites.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No received invitations
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {receivedInvites.map((invite) => (
                  <Card key={invite.inviteId} className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{invite.groupName}</CardTitle>

                        <Badge
                          variant={
                            invite.status === "PENDING"
                              ? "secondary"
                              : invite.status === "ACCEPTED"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {invite.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p>
                            Invited by{" "}
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
            )}
          </TabsContent>

          {/* SENT */}
          <TabsContent value="sent">
            {sent.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No sent invitations
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {sent.map((invite) => (
                  <Card key={invite.inviteId} className="shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{invite.groupName}</CardTitle>

                        <Badge
                          variant={
                            invite.status === "PENDING"
                              ? "secondary"
                              : invite.status === "ACCEPTED"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {invite.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p>
                            Sent to{" "}
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  )
}

export default InvitesPage
