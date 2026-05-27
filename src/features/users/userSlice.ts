import { api } from "@/lib/api"
import type { PublicUserDTO } from "./type"

export async function searchUsers(query: string): Promise<PublicUserDTO[]> {
  const token = localStorage.getItem("token")
  const response = await api.get<PublicUserDTO[]>("/users/search", {
    params: { query },
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
