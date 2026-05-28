export interface GroupDTO {
  groupId: string
  name: string
  description: string
  imageUrl: string | null
  createdAt: string
}

export interface GroupMemberDTO {
  groupMemberId: string
  userId: string
  username: string
  avatarUrl: string | null
  role: "OWNER" | "MEMBER" | "ADMIN"
  joinedAt: string
}

export interface GroupDetailsDTO {
  groupId: string
  name: string
  description: string
  imageUrl: string | null
  createdAt: string
  memberCount: number
  members: GroupMemberDTO[]
}

export interface CreateGroupDTO {
  name: string
  description: string
}
