import type { ReactNode } from "react"
import Navbar from "./Navbar"

interface Props {
  children: ReactNode
}

function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-muted bg-fixed">
      <Navbar />

      <main className="p-6 pt-20">{children}</main>
    </div>
  )
}

export default PageLayout
