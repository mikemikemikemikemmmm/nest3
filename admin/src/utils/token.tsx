import { TOKEN_KEY_IN_LOCALSTORAGE } from "@/const"

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY_IN_LOCALSTORAGE)
}
export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY_IN_LOCALSTORAGE, token)
}
export const deleteToken = () => {
    localStorage.removeItem(TOKEN_KEY_IN_LOCALSTORAGE)
}