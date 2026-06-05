import { useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { fetchCurrentUser, uploadProfileImage } from "@/features/auth/authSlice"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import EditableAvatar from "@/components/layout/EditableAvatar"

interface Props {
  trigger?: React.ReactNode
}

export default function ProfileDetailsDialog({ trigger }: Props) {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)

  const [file, setFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (!file) return

    try {
      await dispatch(uploadProfileImage(file)).unwrap()

      toast.success("Profile picture updated")

      setFile(null)
    } catch (error) {
      toast.error(String(error))
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="ghost">Profile</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <EditableAvatar
            imageUrl={user?.avatarUrl}
            size="h-24 w-24"
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <div className="text-center">
            <p className="font-medium">{user?.username}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">
                Selected: {file.name}
              </p>
            )}
          </div>
          <Button onClick={handleUpload} disabled={!file} className="w-full">
            Upload Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
