import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchGroupDetails } from "../groupSlice"
import { fetchGroupExpenses } from "@/features/expenses/expenseSlice"
import Navbar from "@/components/layout/Navbar"
import InviteMemberDialog from "../components/InviteMemberDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CreateExpenseDialog from "@/features/expenses/components/CreateExpenseDialog"
import ExpenseCard from "@/features/expenses/components/ExpenseCard"
import {
  fetchGroupSplitBalances,
  fetchGroupSummary,
} from "@/features/expenses/balanceSlice"
import OpenDebtsCard from "../../expenses/components/OpenDebtsCard"
import BalanceSummaryCard from "@/features/expenses/components/BalanceSummaryCard"
import SuggestedPaymentsCard from "@/features/expenses/components/SuggestedPaymentsCard"
import MembersCard from "@/features/expenses/components/MembersCard"

function GroupDetailsPage() {
  const { groupId } = useParams()
  const dispatch = useAppDispatch()
  const { selectedGroup, loading, error } = useAppSelector(
    (state) => state.groups
  )
  const currentUser = useAppSelector((state) => state.auth.user)
  const { groupExpenses } = useAppSelector((state) => state.expenses)
  const { groupSummary, groupSplitBalances } = useAppSelector(
    (state) => state.balances
  )

  const summary = groupSummary?.[0]

  const currentMember = selectedGroup?.members.find(
    (member) => member.userId === currentUser?.userId
  )
  const canInviteMembers =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN"

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupDetails(groupId))
      dispatch(fetchGroupExpenses(groupId))
      dispatch(fetchGroupSummary(groupId))
      dispatch(fetchGroupSplitBalances(groupId))
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
    <>
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

        <BalanceSummaryCard summary={summary} />

        <MembersCard group={selectedGroup} currentUser={currentUser} />

        <SuggestedPaymentsCard payments={summary?.optimizedPayments ?? []} />
        <OpenDebtsCard
          debts={groupSplitBalances}
          currentUserId={currentUser?.userId}
          groupId={selectedGroup.groupId}
          currencyCode={summary?.currencyCode}
        />
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
    </>
  )
}

export default GroupDetailsPage
