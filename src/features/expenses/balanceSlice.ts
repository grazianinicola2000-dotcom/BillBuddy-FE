import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { AxiosError } from "axios"
import { api } from "@/lib/api"
import type { GroupBalanceSummaryDTO, SplitBalanceDTO } from "./types"

interface BalanceState {
  groupSummary: GroupBalanceSummaryDTO[]
  groupSplitBalances: SplitBalanceDTO[]
  loading: boolean
  error: string | null
}

const initialState: BalanceState = {
  groupSummary: [],
  groupSplitBalances: [],
  loading: false,
  error: null,
}

export const fetchGroupSplitBalances = createAsyncThunk(
  "balance/fetchGroupSplitBalances",
  async (groupId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<SplitBalanceDTO[]>(
        `/balances/groups/${groupId}/details`,
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
      .addCase(fetchGroupSplitBalances.fulfilled, (state, action) => {
        state.groupSplitBalances = action.payload
      })
      .addCase(fetchGroupSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default balanceSlice.reducer
