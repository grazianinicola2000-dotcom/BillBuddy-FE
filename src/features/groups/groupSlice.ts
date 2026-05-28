import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { api } from "@/lib/api"
import type { CreateGroupDTO, GroupDTO, GroupDetailsDTO } from "./types"
import type { AxiosError } from "axios"
import type { PageResponse } from "@/types/pagination"

interface GroupsState {
  groups: PageResponse<GroupDTO> | null
  selectedGroup: GroupDetailsDTO | null
  loading: boolean
  error: string | null
}

const initialState: GroupsState = {
  groups: null,
  selectedGroup: null,
  loading: false,
  error: null,
}

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<PageResponse<GroupDTO>>("/groups/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to fetch groups"
      )
    }
  }
)

export const fetchGroupDetails = createAsyncThunk(
  "groups/fetchGroupDetails",
  async (groupId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<GroupDetailsDTO>(`/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to fetch group details"
      )
    }
  }
)

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (body: CreateGroupDTO, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.post<GroupDTO>("/groups", body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to create group"
      )
    }
  }
)

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false
        state.groups = action.payload
      })
      .addCase(fetchGroupDetails.fulfilled, (state, action) => {
        state.selectedGroup = action.payload
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        if (state.groups) {
          state.groups.content.unshift(action.payload)
          state.groups.totalElements += 1
        }
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default groupsSlice.reducer
