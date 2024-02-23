import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../config";
import { browserRouter } from "../router";
export type ResponseType<T = any> = {
    data: T,
    isSuccess: true
}|{
    isSuccess: false,
    errorMessage: string
}

export const baseApi = axios.create({ baseURL: BASE_URL })
baseApi.interceptors.response.use((response) => {
    return response
}, function (error) {  // when code is larger than 200
    if (error.response?.status === 401) {
        browserRouter.navigate('/')
    }
    const errorMessage =
        error?.response?.data?.errorMessage || error?.message
    return Promise.reject({ message: errorMessage })
})