import { QueryParams } from "@/type";
import { FORMDATA_KEY_FOR_DTO, KEY_FOR_UPLOAD_IMAGE_FORM_DATA } from "../const";
import { deleteBaseApi, getBaseApi, putBaseApi, postBaseApi } from "./base";
import { CreateDto, UpdateDto } from "./entityType";
export const  enum EntityName {
    User = "User",
    Editing = "Editing",
    Navigation = "Navigation",
    Series = "Series",
    Product = "Product",
    SubProduct = "SubProduct",
    Color = "Color",
    Gender = "Gender",
    Size = "Size"
}

export const getAllApi = <Response>(entityName: EntityName, queryParams?: QueryParams) => getBaseApi<Response>(`entity/${entityName}`, queryParams)
export const getOneByIdApi = <Response>(entityName: EntityName, id: number) => getBaseApi<Response>(`entity/${entityName}/${id}`)
export const updateOneByIdApi = (entityName: EntityName, id: number, updateDto: object) => putBaseApi(`entity/${entityName}/${id}`, updateDto)
export const deleteOneByIdApi = (entityName: EntityName, id: number) => deleteBaseApi(`entity/${entityName}/${id}`)
export const createOneApi = (entityName: EntityName, createDto: object) => postBaseApi(`entity/${entityName}`, createDto)



