import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
          BillBuddy
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          Manage personal and shared expenses with ease. Keep track of groups,
          settlements and balances all in one place.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
