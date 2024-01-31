import { getErrorMessenge } from "../utils/errorHandler"
import { baseApi } from "./base"

export const loginApi = (data: { password: string, name: string }) => baseApi.post('authController/login', data)
    .then(res => {
        if (res.data.error) {
            throw Error(res.data.error)
        } else {
            return {
                result: res.data.result,
                error: undefined
            }
        }
    }).catch(error => {
        return { result: undefined, error: getErrorMessenge(error) }
    })
export const testTokenApi = async () => await baseApi.post(`authController/testToken?temp=${performance.now()}`)
    .then(res => {
        if (res.data.error) {
            throw Error(res.data.error)
        } else {
            return {
                error: undefined,
                result: res.data.result
            }
        }
    }).catch(error => {
        return { result: undefined, error: getErrorMessenge(error) }
    })