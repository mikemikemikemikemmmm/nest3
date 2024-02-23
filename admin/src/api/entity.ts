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




export const createColorAPi = (createDto: CreateDto.Color) => {
    const formData = new FormData()
    formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, createDto.imageFile)
    const copy: Partial<CreateDto.Color> = {...createDto}
    delete copy.imageFile
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(copy))
    return postBaseApi(`entity/${EntityName.Color}`, formData)
}
export const createSubProductAPi = (createDto: CreateDto.SubProduct) => {
    const formData = new FormData()
    formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, createDto.imageFile)
    const copy: Partial<CreateDto.SubProduct> = {...createDto}
    delete copy.imageFile
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(copy))
    return postBaseApi(`entity/${EntityName.SubProduct}`, formData)
}

export const updateColorApi = (updateDto: UpdateDto.Color, id: number) => {
    const formData = new FormData()
    const copy = {...updateDto}
    if (copy.imageFile) {
        formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, copy.imageFile)
        delete copy.imageFile
    }
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(copy))
    return putBaseApi(`entity/${EntityName.Color}/${id}`, formData)
}

export const updateSubProductApi = (updateDto: UpdateDto.SubProduct, id: number) => {
    const formData = new FormData()
    const copy = {...updateDto}
    if (copy.imageFile) {
        formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, copy.imageFile)
        delete copy.imageFile
    }
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(copy))
    return putBaseApi(`entity/${EntityName.SubProduct}/${id}`, formData)
}