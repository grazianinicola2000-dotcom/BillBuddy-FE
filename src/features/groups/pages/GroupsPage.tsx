import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchGroups } from "../groupSlice"
import GroupCard from "../components/GroupCard"
import CreateGroupDialog from "../components/CreateGroupDialog"

function GroupsPage() {
  const dispatch = useAppDispatch()
  const { groups, loading, error } = useAppSelector((state) => state.groups)

  useEffect(() => {
    dispatch(fetchGroups())
  }, [dispatch])

  if (loading) {
    return <div className="p-6">Loading groups...</div>
  }
  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Your Groups</h1>
      <div className="my-4">
        <CreateGroupDialog />
      </div>
      <div className="space-y-4">
        {groups?.content?.map((group) => (
          <GroupCard key={group.groupId} group={group} />
        ))}
      </div>
    </div>
  )
}

export default GroupsPage
