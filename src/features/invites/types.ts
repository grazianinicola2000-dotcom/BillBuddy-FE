export interface CreateInviteDTO {
  username: string
}

export type InviteStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "CANCELLED"

export interface InviteDTO {
  inviteId: string
  groupId: string
  groupName: string
  invitedById: string
  invitedByUsername: string
  receiverId: string
  receiverUsername: string
  status: InviteStatus
  createdAt: string
  expiredAt: string
}
