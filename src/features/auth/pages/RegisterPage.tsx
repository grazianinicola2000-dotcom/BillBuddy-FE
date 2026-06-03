import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"

import { useAppDispatch } from "@/app/hooks"
import { registerUser } from "../authSlice"
import { Link, useNavigate } from "react-router-dom"

function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [username, setUsername] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegistration = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        return
      }
      await dispatch(
        registerUser({ email, password, name, surname, username, dateOfBirth })
      ).unwrap()
      navigate("/login")
      toast.success("Registration successful!")
    } catch (error) {
      toast.error(String(error))
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm p-6">
        <form onSubmit={handleRegistration} className="space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create your account</h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Start managing personal and shared expenses.
            </p>
          </div>

          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(event) => setSurname(event.target.value)}
          />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <div className="text-xs text-muted-foreground">
              Password must contain:
              <ul className="mt-1 list-disc pl-4">
                <li>At least 6 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
            </div>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          <Input
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />
          <Button type="submit" className="w-full">
            Confirm Registration
          </Button>
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage
