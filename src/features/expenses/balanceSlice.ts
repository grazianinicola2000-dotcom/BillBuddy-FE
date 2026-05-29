import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { AxiosError } from "axios"
import { api } from "@/lib/api"
import type { GroupBalanceSummaryDTO } from "./types"

interface BalanceState {
  groupSummary: GroupBalanceSummaryDTO[] | null
  loading: boolean
  error: string | null
}

const initialState: BalanceState = {
  groupSummary: [],
  loading: false,
  error: null,
}

export const fetchGroupSummary = createAsyncThunk(
  "balance/fetchGroupSummary",
  async (groupId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<GroupBalanceSummaryDTO[]>(
        `/balances/groups/${groupId}/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      return thunkAPI.rejectWithValue(axiosError.response?.data)
    }
  }
)

const balanceSlice = createSlice({
  name: "balances",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGroupSummary.fulfilled, (state, action) => {
        state.loading = false
        state.groupSummary = action.payload
      })
      .addCase(fetchGroupSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default balanceSlice.reducer
