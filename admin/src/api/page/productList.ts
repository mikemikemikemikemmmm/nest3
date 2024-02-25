import { deleteBaseApi, getBaseApi, postBaseApi, putBaseApi } from "../base";
import { GetOneResponse, CreateDto } from "../entityType";
import { EntityName } from "../entity";
import { QueryParams } from "@/type";
import { KEY_FOR_UPLOAD_IMAGE_FORM_DATA } from "@/const";
export interface ProductListItemData extends CreateDto.Product {
    id: number
    navigationName: string
    genderName: string,
    subproductId: number,
    imageFileNameListStringifyJson:string
}
export const getProductListDataApi = (queryParams?: QueryParams) =>
    getBaseApi<ProductListItemData[]>(`entity/${EntityName.Product}/forListPage`, queryParams)
export const getNavigationsApi = () =>
    getBaseApi<GetOneResponse.NavigationItem[]>(`entity/${EntityName.Navigation}`)
export const getGendersApi = () =>
    getBaseApi<GetOneResponse.Gender[]>(`entity/${EntityName.Gender}`)


export const insertProductImgApi = (imageFile: File, productId: number) => {
    const formData = new FormData()
    formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, imageFile)
    return postBaseApi(`entity/${EntityName.Product}/image/${productId}`,formData)
}
export const updateProductImgApi = (imageFile: File, productId: number,originImageFileName:string) => {
    const formData = new FormData()
    formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, imageFile)
    return putBaseApi(`entity/${EntityName.Product}/image/${productId}/${originImageFileName}`,formData)
}
export const deleteProductImgApi = ( productId: number,imageName:string) => {
    return deleteBaseApi(`entity/${EntityName.Product}/image/${productId}/${imageName}`)
}