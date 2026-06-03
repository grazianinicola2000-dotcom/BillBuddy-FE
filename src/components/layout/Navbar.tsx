import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { logout } from "@/features/auth/authSlice"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Menu } from "lucide-react"

function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      {/* Brand */}
      <Link to="/dashboard" className="text-xl font-bold">
        BillBuddy
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden items-center gap-2 lg:flex">
        <Link to="/dashboard">
          <Button variant={isActive("/dashboard") ? "secondary" : "ghost"}>
            Dashboard
          </Button>
        </Link>

        <Link to="/expenses">
          <Button variant={isActive("/expenses") ? "secondary" : "ghost"}>
            Personal Expenses
          </Button>
        </Link>

        <Link to="/groups">
          <Button
            variant={
              location.pathname.startsWith("/groups") ? "secondary" : "ghost"
            }
          >
            Groups
          </Button>
        </Link>

        <Link to="/invites">
          <Button variant={isActive("/invites") ? "secondary" : "ghost"}>
            Invites
          </Button>
        </Link>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden lg:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>

              <span>{user?.username}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* MOBILE MENU */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/dashboard">Dashboard</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/expenses">Personal Expenses</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/groups">Groups</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/invites">Invites</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem disabled>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>

                {user?.username}
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default Navbar
