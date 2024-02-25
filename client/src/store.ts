import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { NavigationTree } from './api/get'
import { useSelector } from 'react-redux'

export interface NavigationState {
    navigationTree: NavigationTree[]
}

const initialState = {
    navigationTree: []
} as NavigationState

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
        setNavigationTree: (state, action: PayloadAction<NavigationTree[]>) => {
            state.navigationTree = action.payload
        }
    },
})

export const { setNavigationTree } = navSlice.actions

export const store = configureStore({
    reducer: {
        navSlice: navSlice.reducer
    },
})
export default navSlice.reducer
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector = useSelector<RootState>