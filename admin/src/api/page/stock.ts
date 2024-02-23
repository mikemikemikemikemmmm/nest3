import { getBaseApi } from "../base"
import { EntityName } from "../entity"
export interface SubproductWithStock {
    id: number,
    colorId: number,
    colorName: string,
    stocks: {
        id: number,
        sizeId:number,
        sizeName: string,
        stock: number
    }[]
}
export interface ProductWithStock {
    id: number,
    name: string,
    genderName: string
    navigationName: string,
    subproducts: SubproductWithStock[]
}
export const getProductWithStockApi = (productId?: number) => {
    if (productId) {
        return getBaseApi<ProductWithStock[]>(`entity/${EntityName.Product}/withStock`, { productId: String(productId) })
    }
    return getBaseApi<ProductWithStock[]>(`entity/${EntityName.Product}/withStock`)
}