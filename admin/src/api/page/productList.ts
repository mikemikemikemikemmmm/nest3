import { getBaseApi } from "../base";
import { GetOneResponse, CreateDto } from "../entityType";
import { EntityName } from "../entity";
import { QueryParams } from "@/type";
export interface ProductListItemData extends CreateDto.Product {
    id: number
    navigationName: string
    genderName: string,
    subproductId: number,
    imageCount:number
}
export const getProductListDataApi = (queryParams?: QueryParams) =>
    getBaseApi<ProductListItemData[]>(`entity/${EntityName.Product}/forListPage`, queryParams)
export const getNavigationsApi = () =>
    getBaseApi<GetOneResponse.NavigationItem[]>(`entity/${EntityName.Navigation}`)
export const getGendersApi = () =>
    getBaseApi<GetOneResponse.Gender[]>(`entity/${EntityName.Gender}`)