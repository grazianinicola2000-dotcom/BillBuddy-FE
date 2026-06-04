import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  onUpload: (file: File) => Promise<void>
}

function GroupImgUploadDialog({ open, onOpenChange, title, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    try {
      setLoading(true)

      await onUpload(file)

      onOpenChange(false)
      setFile(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GroupImgUploadDialog
