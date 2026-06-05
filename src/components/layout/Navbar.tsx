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

import { Avatar, AvatarImage } from "@/components/ui/avatar"

import { Menu } from "lucide-react"

import ProfileDetailsDialog from "@/features/users/component/ProfileDetailsDialog"

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
    <nav className="fixed z-10 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* ================= MOBILE ================= */}
      <div className="flex w-full items-center justify-between lg:hidden">
        {/* AVATAR MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} />
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-72">
            <div className="px-2 py-2">
              <p className="font-medium">{user?.username}</p>

              <p className="max-w-[240px] truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>

            <DropdownMenuSeparator />

            <div className="px-1">
              <ProfileDetailsDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Profile
                  </DropdownMenuItem>
                }
              />
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-red-500"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* LOGO */}
        <Link to="/dashboard" className="absolute left-1/2 -translate-x-1/2">
          <span className="text-xl font-bold">BillBuddy</span>
        </Link>

        {/* NAVIGATION MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden w-full items-center justify-between lg:flex">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold">BillBuddy</span>
        </Link>

        {/* NAVIGATION */}
        <div className="flex items-center gap-2">
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

        {/* USER MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} />
              </Avatar>
              <span>{user?.username}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72">
            <div className="px-2 py-2">
              <p className="font-medium">{user?.username}</p>

              <p className="max-w-[240px] truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>

            <DropdownMenuSeparator />

            <div className="px-1">
              <ProfileDetailsDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Profile
                  </DropdownMenuItem>
                }
              />
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-red-500"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default Navbar
