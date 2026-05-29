import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchGroupDetails } from "../groupSlice"
import { fetchGroupExpenses } from "@/features/expenses/expenseSlice"
import Navbar from "@/components/layout/Navbar"
import InviteMemberDialog from "../components/InviteMemberDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { promoteMember, demoteMember, removeMember } from "../groupSlice"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/errorUtils"
import CreateExpenseDialog from "@/features/expenses/components/CreateExpenseDialog"
import ExpenseCard from "@/features/expenses/components/ExpenseCard"
import { fetchGroupSummary } from "@/features/expenses/balanceSlice"

function GroupDetailsPage() {
  const { groupId } = useParams()
  const dispatch = useAppDispatch()
  const { selectedGroup, loading, error } = useAppSelector(
    (state) => state.groups
  )
  const currentUser = useAppSelector((state) => state.auth.user)
  const { groupExpenses } = useAppSelector((state) => state.expenses)
  const { groupSummary } = useAppSelector((state) => state.balances)

  const summary = groupSummary?.[0]

  const currentMember = selectedGroup?.members.find(
    (member) => member.userId === currentUser?.userId
  )
  const isOwner = currentMember?.role === "OWNER"
  const canInviteMembers =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN"

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupDetails(groupId))
      dispatch(fetchGroupExpenses(groupId))
      dispatch(fetchGroupSummary(groupId))
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
                <CreateExpenseDialog
                  groupId={selectedGroup.groupId}
                  members={selectedGroup.members}
                />
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
            <CardTitle>Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Total Expenses</p>

                <p className="text-xl font-bold">
                  {summary?.totalExpenses} {summary?.currencyCode}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Total Settled</p>

                <p className="text-xl font-bold">
                  {summary?.totalSettled} {summary?.currencyCode}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Outstanding Debt
                </p>

                <p className="text-xl font-bold">
                  {summary?.totalOutstanding} {summary?.currencyCode}
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              {summary?.netBalances.map((balance) => (
                <div key={balance.userId} className="flex justify-between py-2">
                  <span>{balance.username}</span>
                  <span
                    className={
                      balance.netBalance >= 0
                        ? "font-semibold text-green-600"
                        : "font-semibold text-red-600"
                    }
                  >
                    {balance.netBalance} {balance.currencyCode}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
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
                                  groupId: selectedGroup.groupId,
                                  userId: member.userId,
                                })
                              ).unwrap()

                              dispatch(fetchGroupDetails(selectedGroup.groupId))
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
                                    groupId: selectedGroup.groupId,
                                    userId: member.userId,
                                  })
                                ).unwrap()
                                dispatch(
                                  fetchGroupDetails(selectedGroup.groupId)
                                )
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
                                groupId: selectedGroup.groupId,

                                userId: member.userId,
                              })
                            ).unwrap()

                            dispatch(fetchGroupDetails(selectedGroup.groupId))
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

        <Card>
          <CardHeader>
            <CardTitle>Suggested Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {summary?.optimizedPayments.map((payment, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>
                  {payment.fromUsername}
                  {" → "}
                  {payment.toUsername}
                </span>
                <span>
                  {payment.amount} {payment.currencyCode}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {groupExpenses?.content.length === 0 ? (
              <p className="text-muted-foreground">No expenses yet</p>
            ) : (
              <div className="space-y-4">
                {groupExpenses?.content.map((expense) => (
                  <ExpenseCard key={expense.expenseId} expense={expense} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GroupDetailsPage
