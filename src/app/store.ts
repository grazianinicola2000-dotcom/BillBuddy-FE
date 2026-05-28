import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/features/auth/authSlice"
import groupReducer from "@/features/groups/groupSlice"
import inviteReducer from "@/features/invites/InviteSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupReducer,
    invites: inviteReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
