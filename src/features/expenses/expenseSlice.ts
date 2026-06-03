import type { PageResponse } from "@/types/pagination"
import type {
  ExpenseDTO,
  ExpenseCategoryDTO,
  CreateExpenseDTO,
  CreateSettlementDTO,
  SettlementDTO,
} from "./types"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { AxiosError } from "axios"
import { api } from "@/lib/api"

interface ExpensesState {
  personalExpenses: PageResponse<ExpenseDTO> | null
  groupExpenses: PageResponse<ExpenseDTO> | null
  myGroupExpenses: PageResponse<ExpenseDTO> | null
  categories: ExpenseCategoryDTO[]
  settlements: SettlementDTO[]
  selectedExpense: ExpenseDTO | null
  loading: boolean
  error: string | null
}

const initialState: ExpensesState = {
  personalExpenses: null,
  groupExpenses: null,
  myGroupExpenses: null,
  categories: [],
  settlements: [],
  selectedExpense: null,
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk(
  "expenses/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<ExpenseCategoryDTO[]>(
        "/expense-categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string
      }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to fetch categories"
      )
    }
  }
)

export const fetchPersonalExpenses = createAsyncThunk(
  "expenses/fetchPersonalExpenses",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<PageResponse<ExpenseDTO>>(
        "/expenses/me/paid",
        {
          params: {
            expenseType: "PERSONAL",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string
      }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to fetch expenses"
      )
    }
  }
)

export const fetchMyGroupExpenses = createAsyncThunk(
  "expenses/fetchMyGroupExpenses",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<PageResponse<ExpenseDTO>>(
        "/expenses/me/paid",
        {
          params: {
            expenseType: "GROUP",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string
      }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to fetch expenses"
      )
    }
  }
)

export const fetchGroupExpenses = createAsyncThunk(
  "expenses/fetchGroupExpenses",
  async (groupId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<PageResponse<ExpenseDTO>>(
        `/groups/${groupId}/expenses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string
      }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to fetch group expenses"
      )
    }
  }
)

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (body: CreateExpenseDTO, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.post<ExpenseDTO>("/expenses", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string
        errors?: string[]
      }>
      return thunkAPI.rejectWithValue(axiosError.response?.data)
    }
  }
)

export const createSettlement = createAsyncThunk(
  "expenses/createSettlement",
  async (body: CreateSettlementDTO, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.post<SettlementDTO>("/settlements", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{
        message: string
        errors?: string[]
      }>
      return thunkAPI.rejectWithValue(axiosError.response?.data)
    }
  }
)

export const fetchGroupSettlements = createAsyncThunk(
  "expenses/fetchGroupSettlements",
  async (groupId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      const response = await api.get<SettlementDTO[]>(
        `/settlements/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      return thunkAPI.rejectWithValue(
        axiosError.response?.data || "Failed to fetch settlements"
      )
    }
  }
)

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(fetchPersonalExpenses.fulfilled, (state, action) => {
        state.personalExpenses = action.payload
      })
      .addCase(fetchGroupExpenses.fulfilled, (state, action) => {
        state.groupExpenses = action.payload
      })
      .addCase(fetchMyGroupExpenses.fulfilled, (state, action) => {
        state.myGroupExpenses = action.payload
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        if (state.groupExpenses) {
          state.groupExpenses.content.unshift(action.payload)
        }
      })
      .addCase(createSettlement.fulfilled, (state, action) => {
        state.settlements.unshift(action.payload)
      })
      .addCase(fetchGroupSettlements.fulfilled, (state, action) => {
        state.settlements = action.payload
      })
  },
})

export default expenseSlice.reducer
