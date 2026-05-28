import { api } from "@/lib/api"
import type { PublicUserDTO } from "./type"

export async function searchUsers(
  groupId: string,
  query: string
): Promise<PublicUserDTO[]> {
  const token = localStorage.getItem("token")
  const response = await api.get<PublicUserDTO[]>(
    `/groups/${groupId}/inviteable-users`,
    {
      params: { query },
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response.data
}
