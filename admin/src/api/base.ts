import axios, { Axios, AxiosRequestConfig, AxiosResponse } from 'axios'
import { BASE_URL, ADMIN_API_PREFIX, TOKEN_KEY_IN_LOCALSTORAGE } from '../const'
import { pushAlertItem, setIsLoading, store } from '../store'
import { deleteToken, getToken } from '../utils/token'
import { browserRouter } from '../router'
export const baseApi = axios.create({
    baseURL: BASE_URL,
})
baseApi.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        //@ts-ignore
        config.headers?.set("Authorization", `Bearer ${token}`)
    }
    return config
})
baseApi.interceptors.response.use((response) => {
    return response
}, function (error) {  // when code is larger than 200
    if (error.response?.status === 401) {
        if(getToken()){
            deleteToken()
        }
        browserRouter.navigate('/')
    }
    const errorMessage =
        error?.response?.data?.errorMessage || error?.message
    return Promise.reject({ message: errorMessage })
})


type ErrorResponse = {
    isSuccess: false,
    errorMessage: string
}
type SuccessResponse<T> = {
    data: T,
    isSuccess: true
}
type ResponseType<T> = SuccessResponse<T> | ErrorResponse
const handleResponse = <T>(resonse: AxiosResponse<ResponseType<T>, any>, successText: string) => {
    if (resonse.data.isSuccess) {
        pushAlertItem({ severity: 'success', text: successText })
        return resonse.data as ResponseType<T>
    } else {
        throw Error(resonse.data.errorMessage)
    }
}
const handleCatch = (error: Error): ErrorResponse => {
    pushAlertItem({
        severity: 'error',
        text: error.message || "發生錯誤"
    })
    return {
        isSuccess: false,
        errorMessage: error.message
    }
}
export const getBaseApi = async <GetData>(
    url: string,
    queryParams?: { [key: string]: string }) => {
    const { dispatch } = store
    dispatch(setIsLoading(true))
    return await baseApi.get(`/${ADMIN_API_PREFIX}/${url}`, { params: queryParams })
        .then(response => {
            return handleResponse<GetData>(response, "取得成功")
        })
        .catch(error => {
            return handleCatch(error)
        })
        .finally(() => {
            dispatch(setIsLoading(false))
        })
}
export const postBaseApi = async (url: string, createDto: object) => {
    const { dispatch } = store
    dispatch(setIsLoading(true))
    return await baseApi.post(`${ADMIN_API_PREFIX}/${url}`, createDto)
        .then(resonse => {
            return handleResponse(resonse, "新增成功")
        })
        .catch(error => {
            return handleCatch(error)
        })
        .finally(() => {
            dispatch(setIsLoading(false))
        })
}
export const putBaseApi = async (url: string, updateDto: object) => {
    const { dispatch } = store
    dispatch(setIsLoading(true))
    return await baseApi.put(`/${ADMIN_API_PREFIX}/${url}`, updateDto)
        .then(resonse => {
            return handleResponse(resonse, "更新成功")
        })
        .catch(error => {
            return handleCatch(error)
        })
        .finally(() => {
            dispatch(setIsLoading(false))
        })
}
export const deleteBaseApi = async (url: string) => {
    const { dispatch } = store
    dispatch(setIsLoading(true))
    return await baseApi.delete(`/${ADMIN_API_PREFIX}/${url}`)
        .then(resonse => {
            return handleResponse(resonse, "刪除成功")
        })
        .catch(error => {
            return handleCatch(error)
        })
        .finally(() => {
            dispatch(setIsLoading(false))
        })
}