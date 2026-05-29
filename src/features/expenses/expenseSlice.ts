import type { PageResponse } from "@/types/pagination"
import type { ExpenseDTO, ExpenseCategoryDTO, CreateExpenseDTO } from "./types"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { AxiosError } from "axios"
import { api } from "@/lib/api"

interface ExpensesState {
  personalExpenses: PageResponse<ExpenseDTO> | null
  groupExpenses: PageResponse<ExpenseDTO> | null
  categories: ExpenseCategoryDTO[]
  selectedExpense: ExpenseDTO | null
  loading: boolean
  error: string | null
}

const initialState: ExpensesState = {
  personalExpenses: null,
  groupExpenses: null,
  categories: [],
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
      .addCase(createExpense.fulfilled, (state, action) => {
        if (state.groupExpenses) {
          state.groupExpenses.content.unshift(action.payload)
        }
      })
  },
})

export default expenseSlice.reducer
