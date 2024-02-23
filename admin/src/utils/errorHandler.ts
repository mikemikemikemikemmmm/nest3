import { pushAlertItem, store } from "../store"
export const dispatchError = (error: string | Error | undefined | unknown) => {
    const message = getErrorMessage(error)
    pushAlertItem({ severity: 'error', text: message })
}
export const dispatchSuccess = (messenge: string) => {
    pushAlertItem({ severity: 'success', text: messenge })
}
export const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message
    } else if (typeof error === 'string') {
        return error
    } else {
        return '發生錯誤'
    }
}