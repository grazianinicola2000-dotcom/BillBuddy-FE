import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface Props {
  imageUrl?: string | null
  size?: string
  onClick: () => void
}

function EditableAvatar({ imageUrl, size = "h-20 w-20", onClick }: Props) {
  return (
    <div className="relative">
      <Avatar className={size}>
        <AvatarImage src={imageUrl ?? undefined} />
      </Avatar>

      <Button
        size="icon"
        variant="secondary"
        type="button"
        className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full shadow-md"
        onClick={onClick}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default EditableAvatar
