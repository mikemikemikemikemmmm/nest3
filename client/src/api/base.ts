import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../config";
export type ErrorResponse = {
    isSuccess: false,
    errorMessage: string
}
export type SuccessResponse<T> = {
    data: T,
    isSuccess: true
}
export type ResponseType<T> = SuccessResponse<T> | ErrorResponse
export const baseApi = axios.create({ baseURL: BASE_URL })
baseApi.interceptors.response.use((response) => {
    return response
}, function (error) {  // when code is larger than 200
    if (error.response?.status === 401) {
        //TODO
        // router.push('/login')
    }
    const errorMessage =
        error?.response?.data?.errorMessage || error?.message
    return Promise.reject({ message: errorMessage })
})