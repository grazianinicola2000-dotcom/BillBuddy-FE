import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { searchUsers } from "@/features/users/userService"
import { sendInvite } from "@/features/invites/InviteSlice"
import type { PublicUserDTO } from "@/features/users/type"
import { toast } from "sonner"

interface InviteMemberDialogProps {
  groupId: string
}

function InviteMemberDialog({ groupId }: InviteMemberDialogProps) {
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<PublicUserDTO[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const users = await searchUsers(groupId, query)
        setResults(users)
      } catch (error) {
        console.error("Failed to search users:", error)
      } finally {
        setLoading(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  async function handleInvite(username: string, userId: string) {
    try {
      setInvitingUserId(userId)
      await sendInvite(groupId, { username })
      setResults((prev) => prev.filter((u) => u.userId !== userId))
      toast.success(`Invite sent to ${username}!`)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to send invite")
      }
    } finally {
      setInvitingUserId(null)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite Member</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Command>
            <CommandList>
              <CommandEmpty>
                {loading ? "Searching..." : "No users found"}
              </CommandEmpty>

              <CommandGroup>
                {results.map((user) => (
                  <CommandItem key={user.userId}>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl || undefined} />

                          <AvatarFallback>
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <span>{user.username}</span>
                      </div>

                      <Button
                        size="sm"
                        disabled={invitingUserId === user.userId}
                        onClick={() => handleInvite(user.username, user.userId)}
                      >
                        {invitingUserId === user.userId
                          ? "Inviting..."
                          : "invite"}
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteMemberDialog
