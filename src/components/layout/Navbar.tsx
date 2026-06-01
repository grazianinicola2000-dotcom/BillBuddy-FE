import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/app/hooks"
import { logout } from "@/features/auth/authSlice"
import logo from "@/assets/logo.png"

function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <nav className="m-0 flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-3">
        <img src={logo} alt="BillBuddy Logo" className="h-10 w-auto" />
      </div>

      <div className="flex items-center gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/expenses">Personal Expenses</Link>
        <Link to="/groups">Groups</Link>
        <Link to="/invites">Invites</Link>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
