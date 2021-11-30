import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { apiSlice } from './slices/api'
import { authSlice } from './slices/auth'
import { combineReducers } from 'redux'

const appReducer = combineReducers({
  auth: authSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});

const userChangeDetectionMiddleware = (store:any) => (next:any) => (action:any) => {
  const user = store.getState().auth.user
  let result = next(action)
  const nextUser = store.getState().auth.user
  if(user && !nextUser || (user && user.email !== nextUser.email)) {
    store.dispatch({ type: 'auth/userChange' })
  }
  return result
}

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/userChange") {
    /* resets RTK query cache on user change */
    return appReducer({ ...state, api: undefined }, action)
  }
  return appReducer(state, action);
};
export const reduxStore = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(userChangeDetectionMiddleware, apiSlice.middleware),
})
export type RootState = ReturnType<typeof reduxStore.getState>

export type AppDispatch = typeof reduxStore.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

declare global {
  type RootState = ReturnType<typeof reduxStore.getState>
}

declare module 'react-redux' {
  interface DefaultRootState extends RootState { }
}