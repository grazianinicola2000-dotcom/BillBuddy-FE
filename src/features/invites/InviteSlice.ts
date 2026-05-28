import { api } from "@/lib/api"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { CreateInviteDTO } from "./types"
import type { AxiosError } from "axios"
import type { InviteDTO } from "./types"
import type { PageResponse } from "@/types/pagination"

interface InvitesState {
  invites: PageResponse<InviteDTO> | null
  sentInvites: PageResponse<InviteDTO> | null
  loading: boolean
  error: string | null
}

const initialState: InvitesState = {
  invites: null,
  sentInvites: null,
  loading: false,
  error: null,
}

export async function sendInvite(groupId: string, body: CreateInviteDTO) {
  const token = localStorage.getItem("token")
  const response = await api.post(`/groups/${groupId}/invites`, body, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export const fetchMyInvites = createAsyncThunk(
  "invites/fetchMyInvites",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<PageResponse<InviteDTO>>("/invites/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to fetch invites"
      )
    }
  }
)

export const fetchSentInvites = createAsyncThunk(
  "invites/fetchSentInvites",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<PageResponse<InviteDTO>>("/invites/sent", {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to fetch invites"
      )
    }
  }
)

export const acceptInvite = createAsyncThunk(
  "invites/acceptInvite",
  async (inviteId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.patch(
        `/invites/${inviteId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to accept invite"
      )
    }
  }
)

export const declineInvite = createAsyncThunk(
  "invites/declineInvite",
  async (inviteId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      await api.patch(
        `/invites/${inviteId}/decline`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return inviteId
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to decline invite"
      )
    }
  }
)

export const cancelInvite = createAsyncThunk(
  "invites/cancelInvite",
  async (inviteId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      await api.patch(
        `/invites/${inviteId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return inviteId
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to cancel invite"
      )
    }
  }
)

const inviteSlice = createSlice({
  name: "invites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyInvites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyInvites.fulfilled, (state, action) => {
        state.loading = false
        state.invites = action.payload
      })
      .addCase(fetchSentInvites.fulfilled, (state, action) => {
        state.sentInvites = action.payload
      })
      .addCase(fetchMyInvites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(acceptInvite.fulfilled, (state, action) => {
        if (state.invites) {
          const invite = state.invites.content.find(
            (invite) => invite.inviteId === action.payload.inviteId
          )
          if (invite) {
            invite.status = action.payload.status
          }
        }
      })
      .addCase(declineInvite.fulfilled, (state, action) => {
        if (state.invites) {
          const invite = state.invites.content.find(
            (invite) => invite.inviteId === action.payload
          )
          if (invite) {
            invite.status = "DECLINED"
          }
        }
      })
      .addCase(cancelInvite.fulfilled, (state, action) => {
        if (state.sentInvites) {
          const invite = state.sentInvites.content.find(
            (invite) => invite.inviteId === action.payload
          )
          if (invite) {
            invite.status = "CANCELLED"
          }
        }
      })
  },
})

export default inviteSlice.reducer
