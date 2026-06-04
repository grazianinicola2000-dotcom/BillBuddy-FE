import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchGroups } from "../groupSlice"
import GroupCard from "../components/GroupCard"
import CreateGroupDialog from "../components/CreateGroupDialog"
import PageLayout from "@/components/layout/PageLayout"
import DashboardStatCard from "@/features/dashboard/components/DashboardStatCard"

function GroupsPage() {
  const dispatch = useAppDispatch()

  const { groups, loading, error } = useAppSelector((state) => state.groups)

  useEffect(() => {
    dispatch(fetchGroups())
  }, [dispatch])

  const groupsList = groups?.content ?? []

  if (loading) {
    return (
      <PageLayout>
        <div className="p-6">Loading groups...</div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Groups</h1>

            <p className="text-muted-foreground">
              {groupsList.length} groups joined
            </p>
          </div>

          <CreateGroupDialog />
        </div>

        {/* Statistics */}
        <div className="grid gap-4 lg:grid-cols-3">
          <DashboardStatCard title="Groups" value={`${groupsList.length}`} />

          <DashboardStatCard
            title="Active Memberships"
            value={`${groupsList.length}`}
          />
        </div>

        {groupsList.length === 0 ? (
          <div className="rounded-lg border p-12 text-center">
            <h3 className="text-lg font-semibold">No groups yet</h3>

            <p className="mt-2 text-muted-foreground">
              Create your first group and start tracking shared expenses.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {groupsList.map((group) => (
              <GroupCard key={group.groupId} group={group} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default GroupsPage
