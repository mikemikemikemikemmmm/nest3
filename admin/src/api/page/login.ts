import { get } from "http"
import { baseApi } from "../base"
import { dispatchError } from "@/utils/errorHandler"
import { TOKEN_KEY_IN_LOCALSTORAGE } from "@/const"
import { getToken, setToken } from "@/utils/token"
export const loginApi = async (data: { password: string, email: string }) => {
    try {
        const login = await baseApi.post('auth/login', data)
        const token = login.data.data
        setToken(token)
        return { isSuccess: true }
    } catch (error) {
        dispatchError((error as any).message || "發生錯誤")
        return { isSuccess: false }
    }
}

export const testTokenApi = async () => {
    const token = getToken()
    try {
        const test = await baseApi.post('auth/testToken', {token})
        return { isSuccess: true }
    } catch (error) {
        return { isSuccess: false }
    }
}