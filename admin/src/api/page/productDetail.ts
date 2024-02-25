import { FORMDATA_KEY_FOR_DTO, KEY_FOR_UPLOAD_IMAGE_FORM_DATA } from "@/const"
import { CreateDto, UpdateDto } from "../entityType"
import { EntityName } from "../entity"
import { postBaseApi, putBaseApi } from "../base"


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
export const createSubProductAPi = (createDto: CreateDto.SubProduct) => {
    const formData = new FormData()
    formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, createDto.imageFile)
    const copy: Partial<CreateDto.SubProduct> = {...createDto}
    delete copy.imageFile
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(copy))
    return postBaseApi(`entity/${EntityName.SubProduct}`, formData)
}
