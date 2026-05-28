import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { api } from "@/lib/api"
import type { LoginRequestDTO, LoginResponseDTO, UserDTO } from "./types"
import type { AxiosError } from "axios"

interface AuthState {
  user: UserDTO | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequestDTO, thunkAPI) => {
    try {
      const response = await api.post<LoginResponseDTO>(
        "/auth/login",
        credentials
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data?.message || "login failed"
      )
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<UserDTO>("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch user"
      )
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem("token", action.payload.token)
        state.loading = false
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
