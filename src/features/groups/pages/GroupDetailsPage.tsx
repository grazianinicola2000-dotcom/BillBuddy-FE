import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchGroupDetails, uploadGroupImage } from "../groupSlice"
import {
  fetchGroupExpenses,
  fetchGroupSettlements,
} from "@/features/expenses/expenseSlice"
import {
  fetchGroupSplitBalances,
  fetchGroupSummary,
} from "@/features/expenses/balanceSlice"

import PageLayout from "@/components/layout/PageLayout"

import InviteMemberDialog from "../components/InviteMemberDialog"
import SettlementHistoryCard from "../components/SettlementHistoryCard"

import CreateExpenseDialog from "@/features/expenses/components/CreateExpenseDialog"
import ExpenseCard from "@/features/expenses/components/ExpenseCard"

import OpenDebtsCard from "../../expenses/components/OpenDebtsCard"
import BalanceSummaryCard from "@/features/expenses/components/BalanceSummaryCard"
import SuggestedPaymentsCard from "@/features/expenses/components/SuggestedPaymentsCard"
import MembersCard from "@/features/groups/components/MembersCard"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { toast } from "sonner"

import EditableAvatar from "@/components/layout/EditableAvatar"
import GroupImgUploadDialog from "../components/GroupImgUploadDialog"

function GroupDetailsPage() {
  const { groupId } = useParams()
  const dispatch = useAppDispatch()

  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  const { selectedGroup, loading, error } = useAppSelector(
    (state) => state.groups
  )

  const currentUser = useAppSelector((state) => state.auth.user)

  const { groupExpenses, settlements } = useAppSelector(
    (state) => state.expenses
  )

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
      dispatch(fetchGroupSettlements(groupId))
    }
  }, [dispatch, groupId])

  if (loading) {
    return (
      <PageLayout>
        <div className="p-6">Loading group details...</div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="p-6 text-red-500">{error}</div>
      </PageLayout>
    )
  }

  if (!selectedGroup) {
    return (
      <PageLayout>
        <div className="p-6">Group not found</div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <EditableAvatar
              imageUrl={selectedGroup.imageUrl}
              onClick={() => setImageDialogOpen(true)}
            />
            <div className="flex-1">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
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
                Created at{" "}
                {new Date(selectedGroup.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* OVERVIEW */}
        <div className="grid gap-6 xl:grid-cols-2">
          <MembersCard group={selectedGroup} currentUser={currentUser} />
          <BalanceSummaryCard summary={summary} />
        </div>

        {/* DEBTS */}
        <div className="grid gap-6 xl:grid-cols-2">
          <SuggestedPaymentsCard payments={summary?.optimizedPayments ?? []} />
          <OpenDebtsCard
            debts={groupSplitBalances}
            currentUserId={currentUser?.userId}
            groupId={selectedGroup.groupId}
            currencyCode={summary?.currencyCode}
          />
        </div>

        {/* SETTLEMENT HISTORY*/}
        <SettlementHistoryCard settlements={settlements} />

        {/* EXPENSES */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {groupExpenses?.content.length === 0 ? (
              <p className="text-muted-foreground">No expenses yet</p>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {groupExpenses?.content.map((expense) => (
                  <ExpenseCard key={expense.expenseId} expense={expense} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <GroupImgUploadDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        title="Update Group Image"
        onUpload={async (file) => {
          await dispatch(
            uploadGroupImage({
              groupId: selectedGroup.groupId,
              file,
            })
          ).unwrap()

          toast.success("Group image updated")
        }}
      />
    </PageLayout>
  )
}

export default GroupDetailsPage
