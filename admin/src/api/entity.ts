import { FORMDATA_KEY_FOR_DTO, FORMDATA_KEY_FOR_FILE } from "../const";
import { deleteBaseApi, getBaseApi, patchBaseApi, postBaseApi } from "./base";
import { CreateDto, UpdateDto } from "./entityType";
export enum EntityName {
    User = "User",
    Editing = "Editing",
    Menu = "Menu",
    Category = "Category",
    SubCategory = "SubCategory",
    Series = "Series",
    Product = "Product",
    SubProduct = "SubProduct",
    Color = "Color",
    Gender = "Gender",
    Size = "Size"
}

export const getAllApi = <Response>(entityName: EntityName) => getBaseApi<Response>(entityName)
export const getOneByIdApi = <Response>(entityName: EntityName, id: number) => getBaseApi<Response>(`${entityName}/${id}`)
export const updateOneByIdApi = <UpdateDto>(entityName: EntityName, id: number, updateDto: UpdateDto) => patchBaseApi(`${entityName}/${id}`, updateDto)
export const deleteOneByIdApi = (entityName: EntityName, id: number) => deleteBaseApi(`${entityName}/${id}`)
export const createOneApi = <CreateDto>(entityName: EntityName, createDto: CreateDto) => postBaseApi(entityName, createDto)

export const createColorAPi = (createDto: CreateDto.Color & { file: File }) => {
    const _dto: CreateDto.Color & { file?: File } = createDto
    delete _dto.file
    const formData = new FormData()
    formData.append(FORMDATA_KEY_FOR_FILE, createDto.file)
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(_dto))
    return postBaseApi(EntityName.Color, formData)
}
export const createSubProductAPi = (createDto: CreateDto.SubProduct & { file: File }) => {
    const _dto: CreateDto.SubProduct & { file?: File } = createDto
    delete _dto.file
    const formData = new FormData()
    formData.append(FORMDATA_KEY_FOR_FILE, createDto.file)
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(_dto))
    return postBaseApi(EntityName.SubProduct, formData)
}

export const updateColorApi = (updateDto: UpdateDto.Color & { file?: File }, id: number) => {
    const formData = new FormData()
    if (updateDto.file) {
        formData.append(FORMDATA_KEY_FOR_FILE, updateDto.file)
        delete updateDto.file
    }
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(updateDto))
    return patchBaseApi(`${EntityName.Color}/${id}`, formData)
}

export const updateSubProductApi = (updateDto: UpdateDto.SubProduct & { file?: File }, id: number) => {
    const formData = new FormData()
    if (updateDto.file) {
        formData.append(FORMDATA_KEY_FOR_FILE, updateDto.file)
        delete updateDto.file
    }
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(updateDto))
    return patchBaseApi(`${EntityName.SubProduct}/${id}`, formData)
}

export const checkEntityIsEditingApi =
    (entity: EntityName, id: number) => getBaseApi(`checkEntityIsEditingApi/${entity}/${id}`)