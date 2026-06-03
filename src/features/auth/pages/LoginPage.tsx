import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

import { useAppDispatch } from "@/app/hooks"
import { loginUser, fetchCurrentUser } from "../authSlice"
import { Link, useNavigate } from "react-router-dom"

function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await dispatch(loginUser({ email, password })).unwrap()
      await dispatch(fetchCurrentUser()).unwrap()
      navigate("/dashboard")
      toast.success("Login successful!")
    } catch (error) {
      toast.error(String(error))
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm p-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Login</h1>
          </div>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary">
              Register
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
