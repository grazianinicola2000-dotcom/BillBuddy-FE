export type ExpenseType = "PERSONAL" | "GROUP"
export type CurrencyCode = "EUR" | "USD" | "GBP"

export interface ExpenseCategoryDTO {
  expenseCategoryId: string
  name: string
  icon: string
}

export interface ExpenseSplitDTO {
  expenseSplitId: string
  userId: string
  username: string
  amountOwed: number
  amountPaid: number
}

export interface ExpenseDTO {
  expenseId: string
  title: string
  description: string
  totalAmount: number
  expenseType: ExpenseType
  groupId?: string
  groupName?: string
  paidById: string
  paidByUsername: string
  categoryId?: string
  categoryName?: string
  expenseDate: string
  currencyCode: CurrencyCode
  splits: ExpenseSplitDTO[]
  createdAt: string
}

export interface CreateExpenseDTO {
  title: string
  description?: string
  totalAmount: number
  groupId?: string
  categoryId?: string
  expenseDate: string
  currencyCode: CurrencyCode
  participantIds: string[]
}

export interface NetBalanceDTO {
  userId: string
  username: string
  netBalance: number
  currencyCode: CurrencyCode
}

export interface OptimizedPaymentDTO {
  formUserId: string
  fromUsername: string
  toUserId: string
  toUsername: string
  amount: number
  currencyCode: CurrencyCode
}

export interface GroupBalanceSummaryDTO {
  groupId: string
  groupName: string
  currencyCode: CurrencyCode
  totalExpenses: number
  totalSettled: number
  totalOutstanding: number
  netBalances: NetBalanceDTO[]
  optimizedPayments: OptimizedPaymentDTO[]
}

export interface SplitBalanceDTO {
  expenseId: string
  expenseTitle: string
  expenseSplitId: string
  debtorId: string
  debtorUsername: string
  creditorId: string
  creditorUsername: string
  originalAmount: number
  amountPaid: number
  remainingDebt: number
  currencyCode: CurrencyCode
  settled: boolean
}

export interface CreateSettlementDTO {
  expenseSplitId: string
  amount: number
  currencyCode: CurrencyCode
  note?: string
}

export interface SettlementDTO {
  settlementId: string
  payerId: string
  payerUsername: string
  receiverId: string
  receiverUsername: string
  groupId: string
  groupName: string
  amount: number
  currencyCode: CurrencyCode
  note?: string
  createdAt: string
}
