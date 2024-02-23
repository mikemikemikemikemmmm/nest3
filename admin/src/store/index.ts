import { configureStore, createSlice, Dispatch } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
type AlertSeverity = 'error' | 'warning' | 'info' | 'success'
export interface AlertItem { severity: AlertSeverity, text: string, id?: number }
export interface IState {
    isLoading: boolean
    alertList: AlertItem[]
}

const initialState: IState = {
    isLoading: false,
    alertList: []
}

export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            if (state.isLoading === action.payload) {
                return
            }
            state.isLoading = action.payload
        },
        //private
        pustAlertListSingleItem: (state, action: PayloadAction<AlertItem>) => {
            state.alertList = [...state.alertList, action.payload]
        },
        shiftAlertListItem: (state) => {
            if (state.alertList.length > 0) {
                const copy = [...state.alertList]
                copy.shift()
                state.alertList = copy
            }
        },
        deleteAlertListItemById: (state, action: PayloadAction<number>) => {
            const targetIndex = state.alertList.findIndex(a => a.id === action.payload)
            if (targetIndex !== -1) {
                const newList = [...state.alertList]
                newList.splice(targetIndex)
                state.alertList = newList
            }
        }
    },
})
const { pustAlertListSingleItem } = appSlice.actions
export const {
    setIsLoading,
    shiftAlertListItem,
    deleteAlertListItemById } = appSlice.actions
export default appSlice.reducer

export const store = configureStore({
    reducer: {
        appSlice: appSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
/**
 * ---------------------------------------------------------------------------
 */
//methods
export const pushAlertItem = (alertItem: AlertItem) => {
    const { dispatch } = store
    const state = store.getState()
    const { alertList } = state.appSlice
    if (alertList.length >= 6) {
        dispatch(shiftAlertListItem())
    }
    const alertData = { ...alertItem, id: Math.random()}
    dispatch(pustAlertListSingleItem(alertData))
    setTimeout(() => {
        dispatch(deleteAlertListItemById(alertData.id))
    }, 3000)
}
/**
 * ---------------------------------------------------------------------------
 */