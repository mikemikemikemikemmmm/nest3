import { baseApi, ErrorResponse, ResponseType } from "./base"
import { CLIENT_API_PREFIX } from "../config"
import { AxiosResponse } from "axios"
const handleResponse = <T>(resonse: AxiosResponse<ResponseType<T>, any>) => {
    if (resonse.data.isSuccess) {
        return resonse.data as ResponseType<T>
    } else {
        throw Error(resonse.data.errorMessage)
    }
}

const handleCatch = (error: Error): ErrorResponse => {
    return {
        isSuccess: false,
        errorMessage: error.message || "發生錯誤"
    }
}

export const getBaseApi = async <GetData>(url: string, queryParams?: { [key: string]: string }) => {
    return await baseApi.get(`/${CLIENT_API_PREFIX}/${url}`, { params: queryParams })
        .then(response => {
            return handleResponse<GetData>(response)
        })
        .catch(error => {
            return handleCatch(error)
        })
}


type NavigationType = "menu" | "category" | "subCategory"
export interface NavigationTree {
    id: number,
    name: string,
    route: string
    type: NavigationType,
    children: NavigationTree[]
}
export const getNavigationTreeApi = () => getBaseApi<NavigationTree[]>('navigation')
export interface ProductCard {
    id: number,
    name: string,
    subproducts: {
        colorId: number,
        id: number,
        colorName: string,
        price: number
    }[]
}
export interface SeriesData {
    id: number,
    name: string,
    productCards: ProductCard[]
}
export const getSeriesDataApi = (menuRoute: string, categoryRoute: string = "", subcategoryRoute: string = "") => {
    const queryParams = { menuRoute } as { [key: string]: string }
    if (categoryRoute !== "") {
        queryParams.categoryRoute = categoryRoute
    }
    if (subcategoryRoute !== "") {
        queryParams.subcategoryRoute = subcategoryRoute
    }
    return getBaseApi<SeriesData[]>("series", queryParams)
}
export interface SizeData {
    id: number,
    name: string
}
export interface SubproductData {
    id: number,
    price: number,
    colorId: number,
    colorName: string,
    sizes: SizeData[]
}
export interface ProductDetailData {
    imageFileNameListStringifyJson: string
    id: number,
    name: string,
    genderId: number,
    genderName: string,
    subproducts: SubproductData[]
}
export const getProductDetailByProductIdApi = (productId: string) =>
    getBaseApi<ProductDetailData>(`productDetail/${productId}`)


export const getProductMenuRouteApi = (productId: string) =>
    getBaseApi<{ menuRoute: string }>(`menuRoute/${productId}`)
