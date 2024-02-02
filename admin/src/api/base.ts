import axios, { AxiosRequestConfig } from 'axios'
import { BASE_URL, ADMIN_API_PREFIX, TOKEN_HEADER } from '../const'
import { pushAlertItem, setIsLoading, store } from '../store'
import { dispatchError, getErrorMessenge } from '../utils/errorHandler'
import { getToken } from '../utils/token'
import { browserRouter } from '../router'
// type TErrorRes = {
//     error: string,
//     result: undefined
// }
// type TSelectRes<T> = {
//     result: T
//     error: undefined
// } | TErrorRes
// type TInsertRes = {
//     result: unknown[]
//     error: undefined
// } | TErrorRes
// type TDeleteRes = TInsertRes
// type TUpdateRes = TInsertRes

export const baseApi = axios.create({
    baseURL: BASE_URL,
})
baseApi.interceptors.request.use((config) => {
    if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set(TOKEN_HEADER, getToken())
    }
    return config
})
baseApi.interceptors.response.use((response) => {
    return response
}, function (error) {
    if (error.response) {
        if (error.response.status === 401) {
            browserRouter.navigate('/')
        }
        return error.response
    }
})
export const getBaseApi = async <ResponseType>(url: string) => {
    const { dispatch } = store
    dispatch(setIsLoading(true))
    const response = await baseApi.get(`/${ADMIN_API_PREFIX}/${url}`)
    const { data } = response
    dispatch(setIsLoading(false))
    if (data.error) {
        pushAlertItem({ severity: 'error', text: data.error })
        return { error: data.error }
    }
    pushAlertItem({ severity: 'success', text: `取得資料成功` })
    return { result: data.result as ResponseType }
}
export const postBaseApi = async <CreateDto>(url: string, createDto: CreateDto) => {
    const { dispatch } = store
    dispatch(setIsLoading(true))
    const response = await baseApi.post(`/${ADMIN_API_PREFIX}/${url}`, createDto)
    const { data } = response
    dispatch(setIsLoading(false))
    if (data.error) {
        pushAlertItem({ severity: 'error', text: data.error })
        return { error: data.error }
    }
    pushAlertItem({ severity: 'success', text: `新增資料成功` })
    return { result: data.result as ResponseType }
}
export const patchBaseApi = async <UpdateDto>(url: string, updateDto: UpdateDto) => {
    const { dispatch } = store
    dispatch(setIsLoading(true))
    const response = await baseApi.post(`/${ADMIN_API_PREFIX}/${url}`, updateDto)
    const { data } = response
    dispatch(setIsLoading(false))
    if (data.error) {
        pushAlertItem({ severity: 'error', text: data.error })
        return { error: data.error }
    }
    pushAlertItem({ severity: 'success', text: `修改資料成功` })
    return { result: data.result as ResponseType }
}
export const deleteBaseApi = async (url: string) => {
    const { dispatch } = store
    dispatch(setIsLoading(true))
    const response = await baseApi.delete(`/${ADMIN_API_PREFIX}/${url}`)
    const { data } = response
    dispatch(setIsLoading(false))
    if (data.error) {
        pushAlertItem({ severity: 'error', text: data.error })
        return { error: data.error }
    }
    pushAlertItem({ severity: 'success', text: `資料成功` })
    return { result: data.result as ResponseType }
}
// export const getBaseApi = async <DataType>(url: string, confing?: AxiosRequestConfig<any>) => {
//     const _store = store
//     const { dispatch } = _store
//     dispatch(setIsLoading(true))
//     try {
//         const res = await baseApi.get<TSelectRes<DataType>>(`/${ADMIN_API_PREFIX}/${url}`, confing)
//         const data = res.data as TSelectRes<DataType>
//         if (data.error) {
//             throw Error(data.error)
//         } else {
//             pushAlertItem({ severity: 'success', text: `取得資料成功` })
//             return { result: data.result, error: undefined }
//         }
//     } catch (error) {
//         pushAlertItem({ severity: 'error', text: getErrorMessenge(error) })
//         return { result: undefined, error: getErrorMessenge(error) }
//     }
//     finally {
//         dispatch(setIsLoading(false))
//     }
// }
// export const postBaseApi = async<T>(url: string, _data: T, showText: string = "") => {
//     const { dispatch } = store
//     dispatch(setIsLoading(true))
//     try {
//         const res = await baseApi.post(url, _data)
//         const data = res.data as TInsertRes
//         if (data.error) {
//             throw Error(data.error)
//         } else {
//             pushAlertItem({ severity: 'success', text: `${showText}新增成功` })
//             return {
//                 result: data.result
//             }
//         }
//     } catch (error) {
//         pushAlertItem({ severity: 'error', text: getErrorMessenge(error) })
//         return { result: undefined, error: getErrorMessenge(error) }

//     }
//     finally {
//         dispatch(setIsLoading(false))
//     }
// }
// export const deleteBaseApi = async (url: string, showText: string = "") => {
//     const { dispatch } = store
//     dispatch(setIsLoading(true))
//     try {
//         const res = await baseApi.delete(url)
//         const data = res.data as TDeleteRes
//         if (data.error) {
//             throw new Error(data.error)
//         } else {
//             pushAlertItem({ severity: 'success', text: `${showText}刪除資料成功` })
//             return { result: data.result }
//         }
//     } catch (error) {
//         pushAlertItem({ severity: 'error', text: getErrorMessenge(error) })
//         return { result: undefined, error: getErrorMessenge(error) }

//     }
//     finally {
//         dispatch(setIsLoading(false))
//     }
// }
// export const patchBaseApi = async <T>(url: string, _data: T, showText: string = "") => {
//     const { dispatch } = store
//     dispatch(setIsLoading(true))
//     try {
//         const res = await baseApi.put(url, _data)
//         const data = res.data as TUpdateRes
//         if (data.error) {
//             throw Error(data.error)
//         } else {
//             pushAlertItem({ severity: 'success', text: `修改成功` })

//         }
//     } catch (error) {
//         pushAlertItem({ severity: 'error', text: getErrorMessenge(error) })
//         return { result: undefined, error: getErrorMessenge(error) }

//     }
//     finally {
//         dispatch(setIsLoading(false))
//     }
// }