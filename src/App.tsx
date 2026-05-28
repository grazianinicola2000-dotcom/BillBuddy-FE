import AppRouter from "@/routes/AppRouter"
import { useAppDispatch } from "@/app/hooks"
import { fetchCurrentUser } from "@/features/auth/authSlice"
import { useEffect } from "react"

function App() {
  const dispatch = useAppDispatch()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, token])

  return <AppRouter />
}

export default App
